import { useState, useCallback, useEffect } from "react";
import { useConversation } from "@elevenlabs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";

function getUserProfile() {
  try {
    const stored = localStorage.getItem("pathwise-profile");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export default function VoiceAdvisorPage() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcripts, setTranscripts] = useState<
    { role: "user" | "agent"; text: string }[]
  >([]);
  const [partialUser, setPartialUser] = useState("");
  const [partialAgent, setPartialAgent] = useState("");

  const conversation = useConversation({
    onConnect: () => {
      toast({ title: "Connected", description: "You're now talking to your advisor." });
    },
    onDisconnect: () => {
      toast({ title: "Call ended", description: "Your voice session has ended." });
    },
    onMessage: (message: any) => {
      if (message.type === "user_transcript") {
        const text = message.user_transcription_event?.user_transcript;
        if (text) {
          setPartialUser("");
          setTranscripts((prev) => [...prev, { role: "user", text }]);
        }
      } else if (message.type === "agent_response") {
        const text = message.agent_response_event?.agent_response;
        if (text) {
          setPartialAgent("");
          setTranscripts((prev) => [...prev, { role: "agent", text }]);
        }
      } else if (message.type === "agent_response_correction") {
        const text = message.agent_response_correction_event?.corrected_agent_response;
        if (text) {
          setTranscripts((prev) => {
            const updated = [...prev];
            if (updated.length > 0 && updated[updated.length - 1].role === "agent") {
              updated[updated.length - 1].text = text;
            }
            return updated;
          });
        }
      }
    },
    onError: (error: any) => {
      console.error("Conversation error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to voice advisor. Please try again.",
      });
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const profile = getUserProfile();
      const { data, error } = await supabase.functions.invoke(
        "elevenlabs-conversation-token",
        {
          body: {
            userProfile: profile
              ? {
                  educationLevel: profile.educationLevel,
                  careerInterests: profile.careerInterests || profile.interests,
                  longTermGoals: profile.longTermGoals,
                  schoolName: profile.schoolName,
                }
              : null,
          },
        }
      );

      if (error || !data?.token) {
        throw new Error(error?.message || "No token received");
      }

      setTranscripts([]);
      await conversation.startSession({
        conversationToken: data.token,
        connectionType: "webrtc",
      });
    } catch (error: any) {
      console.error("Failed to start conversation:", error);
      if (error.name === "NotAllowedError") {
        toast({
          variant: "destructive",
          title: "Microphone Access Required",
          description: "Please enable microphone access to use voice features.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: error.message || "Could not start voice session.",
        });
      }
    } finally {
      setIsConnecting(false);
    }
  }, [conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] px-4">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Voice Advisor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isConnected
                ? isSpeaking
                  ? "Advisor is speaking..."
                  : "Listening to you..."
                : "Talk to your AI advisor in real-time"}
            </p>
          </div>

          {/* Visual orb */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className={`w-40 h-40 rounded-full flex items-center justify-center ${
                isConnected ? "gradient-cta" : "bg-muted"
              }`}
              animate={
                isConnected
                  ? {
                      scale: isSpeaking ? [1, 1.12, 1] : [1, 1.04, 1],
                      opacity: isSpeaking ? [1, 0.85, 1] : 1,
                    }
                  : {}
              }
              transition={{
                duration: isSpeaking ? 0.6 : 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {isConnected ? (
                <Volume2 className="w-12 h-12 text-primary-foreground" />
              ) : (
                <Mic className="w-12 h-12 text-muted-foreground" />
              )}
            </motion.div>

            {/* Pulse rings when connected */}
            {isConnected && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  style={{ width: 160, height: 160 }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/20"
                  animate={{ scale: [1, 1.9], opacity: [0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                  style={{ width: 160, height: 160 }}
                />
              </>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-4">
            {!isConnected ? (
              <Button
                onClick={startConversation}
                disabled={isConnecting}
                size="lg"
                className="gradient-cta text-primary-foreground border-0 hover:opacity-90 rounded-full px-8 gap-2"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    Start Conversation
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={endConversation}
                size="lg"
                variant="destructive"
                className="rounded-full px-8 gap-2"
              >
                <PhoneOff className="w-5 h-5" />
                End Call
              </Button>
            )}
          </div>

          {/* Live transcript */}
          {(transcripts.length > 0 || isConnected) && (
            <div className="w-full bg-card border border-border/50 rounded-xl p-4 max-h-60 overflow-y-auto">
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Live Transcript
              </p>
              <div className="space-y-2">
                <AnimatePresence>
                  {transcripts.map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-sm ${
                        t.role === "user"
                          ? "text-muted-foreground"
                          : "text-foreground font-medium"
                      }`}
                    >
                      <span className="text-xs font-semibold mr-1.5">
                        {t.role === "user" ? "You:" : "Advisor:"}
                      </span>
                      {t.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isConnected && !isSpeaking && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MicOff className="w-3 h-3" />
                    <span>Listening...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          {!isConnected && transcripts.length === 0 && (
            <div className="text-center text-xs text-muted-foreground max-w-sm space-y-1">
              <p>💡 Try asking:</p>
              <p className="italic">"What should I focus on to land a tech internship?"</p>
              <p className="italic">"Help me prepare for my upcoming interview"</p>
              <p className="italic">"What career paths match my interests?"</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
