"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function AutoSaveToast() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Auto Saved",
        });
      }}
    >
      Show Toast
    </Button>
  );
}
