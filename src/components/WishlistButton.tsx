"use client";

import React, { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  entityId: string;
  entityType: string;
  entityName: string;
  className?: string;
}

export function WishlistButton({ entityId, entityType, entityName, className }: WishlistButtonProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const wishlistQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "savedItems"),
      where("savedEntityId", "==", entityId)
    );
  }, [firestore, user?.uid, entityId]);

  const { data: savedItems } = useCollection(wishlistQuery);
  const isSaved = savedItems && savedItems.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user || !firestore) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save items to your wishlist.",
      });
      return;
    }

    setIsProcessing(true);

    if (isSaved) {
      const itemToDelete = savedItems[0];
      deleteDocumentNonBlocking(doc(firestore, "users", user.uid, "savedItems", itemToDelete.id));
      toast({ title: "Removed", description: `${entityName} removed from wishlist.` });
    } else {
      addDocumentNonBlocking(collection(firestore, "users", user.uid, "savedItems"), {
        userId: user.uid,
        savedEntityId: entityId,
        savedEntityType: entityType,
        savedEntityName: entityName,
        savedAt: new Date().toISOString(),
      });
      toast({ title: "Saved!", description: `${entityName} added to your wishlist.` });
    }

    // Small delay to prevent flickering
    setTimeout(() => setIsProcessing(false), 500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-all",
        isSaved && "text-accent bg-white/40",
        className
      )}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <Heart size={18} className={cn(isSaved && "fill-current")} />
      )}
    </Button>
  );
}