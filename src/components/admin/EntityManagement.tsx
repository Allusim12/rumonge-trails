"use client";

import React, { useState, useRef } from "react";
import { useFirestore, useCollection, useMemoFirebase, useStorage } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit2, X, Save, Search, Loader2, ImageIcon, Mail, Upload, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface EntityManagementProps {
  collectionName: string;
}

export function EntityManagement({ collectionName }: EntityManagementProps) {
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adjust collection name for "singleton" content stored in site_content
  const isOffice = collectionName === "site_content_office";
  const actualCollection = isOffice ? "site_content" : collectionName;

  const entityQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, actualCollection), orderBy("updatedAt", "desc")) : null
  , [firestore, actualCollection]);

  const { data: entities, isLoading } = useCollection(entityQuery);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    const data = {
      ...formData,
      updatedAt: serverTimestamp(),
    };

    // If it's a singleton document like 'hero' or 'office'
    if (actualCollection === "site_content") {
      const docId = isOffice ? "office" : "hero";
      setDocumentNonBlocking(doc(firestore, "site_content", docId), data, { merge: true });
      toast({ title: "Saved", description: "Homepage section updated." });
    } else if (editingId) {
      updateDocumentNonBlocking(doc(firestore, actualCollection, editingId), data);
      toast({ title: "Updated", description: "Record updated successfully." });
    } else {
      data.createdAt = serverTimestamp();
      addDocumentNonBlocking(collection(firestore, actualCollection), data);
      toast({ title: "Created", description: "New record added successfully." });
    }

    resetForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storage) return;

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setFormData((prev: any) => ({
        ...prev,
        imageUrl: downloadURL,
        url: downloadURL // Handle both common image key names
      }));
      
      toast({ title: "Upload Complete", description: "Image stored and linked." });
    } catch (error) {
      console.error("Upload error", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "Check storage permissions." });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setIsAdding(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (entity: any) => {
    setFormData(entity);
    setEditingId(entity.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm("Delete this record?")) return;
    try {
      await deleteDoc(doc(firestore, actualCollection, id));
      toast({ title: "Deleted", description: "Record removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete." });
    }
  };

  const filteredEntities = entities?.filter(e => {
    if (isOffice) return e.id === "office";
    if (collectionName === "site_content") return e.id === "hero";
    const name = (e.name || e.title || e.email || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground font-bold">Synchronizing...</p>
    </div>
  );

  const displayTitle = isOffice ? "Commune Office" : collectionName === "site_content" ? "Homepage Hero" : collectionName;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {!isAdding && !isOffice && collectionName !== "site_content" && collectionName !== "newsletter_subscriptions" && (
          <Button onClick={() => setIsAdding(true)} className="rounded-xl h-12 px-6 font-bold shadow-lg">
            <Plus size={20} className="mr-2" />
            Add New Record
          </Button>
        )}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search records..." 
            className="pl-10 rounded-xl h-12 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isAdding && (
        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-3xl animate-in slide-in-from-top-4 duration-500">
          <div className="h-2 bg-primary" />
          <CardContent className="pt-8">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-headline text-3xl font-bold">{editingId ? 'Refine' : 'Add'} Record</h3>
                  <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">{displayTitle}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={resetForm} className="rounded-full">
                  <X size={24} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                      {isOffice ? "Administrator Name" : "Headline / Name"}
                    </label>
                    <Input 
                      required 
                      value={formData.name || formData.title || ""} 
                      onChange={(e) => setFormData({...formData, name: e.target.value, title: e.target.value})}
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                       {isOffice ? "Role / Subtitle" : "Type / Badge / Category"}
                    </label>
                    <Input 
                      value={formData.type || formData.badge || formData.category || formData.subtitle || ""} 
                      onChange={(e) => setFormData({...formData, type: e.target.value, badge: e.target.value, category: e.target.value, subtitle: e.target.value})}
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>

                {!(collectionName === 'travelTips' || collectionName === 'newsletter_subscriptions') && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> Image Management
                    </label>
                    
                    <div className="flex flex-col gap-4 p-4 bg-secondary/20 rounded-2xl border">
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white border shadow-inner">
                        {(formData.imageUrl || formData.url) ? (
                          <Image src={formData.imageUrl || formData.url} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            <ImageIcon size={48} className="opacity-20" />
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="animate-spin text-white" size={32} />
                          </div>
                        )}
                      </div>

                      <Tabs defaultValue="upload" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl">
                          <TabsTrigger value="upload" className="rounded-lg"><Upload size={14} className="mr-2" /> Upload</TabsTrigger>
                          <TabsTrigger value="link" className="rounded-lg"><LinkIcon size={14} className="mr-2" /> Link</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upload" className="pt-2">
                          <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                            className="rounded-xl h-12"
                            disabled={isUploading}
                          />
                        </TabsContent>
                        <TabsContent value="link" className="pt-2">
                          <Input 
                            value={formData.imageUrl || formData.url || ""} 
                            onChange={(e) => setFormData({...formData, imageUrl: e.target.value, url: e.target.value})}
                            placeholder="https://..."
                            className="rounded-xl h-12"
                          />
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                )}
              </div>

              {collectionName !== 'newsletter_subscriptions' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                     {isOffice ? "Administrator Quote / Mission" : "Description / Subtitle / Content"}
                  </label>
                  <Textarea 
                    required
                    value={formData.description || formData.subtitle || formData.content || ""} 
                    onChange={(e) => setFormData({...formData, description: e.target.value, subtitle: e.target.value, content: e.target.value})}
                    className="rounded-2xl min-h-[150px]"
                  />
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 h-14 rounded-2xl font-bold text-lg" disabled={isUploading}>
                  <Save size={20} className="mr-2" />
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="h-14 rounded-2xl px-8">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-2xl overflow-hidden bg-white rounded-3xl">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="font-bold py-6 pl-8">Identity</TableHead>
              <TableHead className="font-bold py-6">Category / Info</TableHead>
              <TableHead className="text-right font-bold py-6 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities && filteredEntities.length > 0 ? filteredEntities.map((entity) => (
              <TableRow key={entity.id} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-bold py-6 pl-8">
                  <div className="flex items-center gap-4">
                    {!(collectionName === 'travelTips' || collectionName === 'newsletter_subscriptions') && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary/30 border">
                        {(entity.imageUrl || entity.url) && <Image src={entity.imageUrl || entity.url} alt="" fill className="object-cover" />}
                      </div>
                    )}
                    {collectionName === 'newsletter_subscriptions' ? (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-primary" />
                        <span>{entity.email}</span>
                      </div>
                    ) : (
                      <span>{entity.name || entity.title || entity.id}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  {collectionName === 'newsletter_subscriptions' ? (
                     <span className="text-muted-foreground text-xs italic">
                        Subscribed on {entity.subscribedAt?.seconds ? new Date(entity.subscribedAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                     </span>
                  ) : (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                      {entity.type || entity.badge || entity.category || entity.subtitle || "General"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right py-6 pr-8">
                  <div className="flex justify-end gap-2">
                    {collectionName !== 'newsletter_subscriptions' && (
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(entity)}><Edit2 size={18} /></Button>
                    )}
                    {!isOffice && collectionName !== "site_content" && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(entity.id)}><Trash2 size={18} /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={3} className="text-center py-20">No records found. Seed data to begin.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
