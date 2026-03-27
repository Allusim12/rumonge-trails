"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit2, X, Save, Search, Loader2, Database, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface EntityManagementProps {
  collectionName: string;
}

export function EntityManagement({ collectionName }: EntityManagementProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");

  const entityQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, collectionName), orderBy("updatedAt", "desc")) : null
  , [firestore, collectionName]);

  const { data: entities, isLoading } = useCollection(entityQuery);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    const data = {
      ...formData,
      updatedAt: serverTimestamp(),
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, collectionName, editingId), data);
      toast({ title: "Updated", description: "Record updated successfully." });
    } else {
      data.createdAt = serverTimestamp();
      addDocumentNonBlocking(collection(firestore, collectionName), data);
      toast({ title: "Created", description: "New record added successfully." });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setIsAdding(false);
  };

  const handleEdit = (entity: any) => {
    setFormData(entity);
    setEditingId(entity.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm("Delete this record?")) return;
    try {
      await deleteDoc(doc(firestore, collectionName, id));
      toast({ title: "Deleted", description: "Record removed." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete." });
    }
  };

  const filteredEntities = entities?.filter(e => {
    const name = (e.name || e.title || e.email || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground font-bold">Synchronizing...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {!isAdding && (
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
                  <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest">{collectionName}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={resetForm} className="rounded-full">
                  <X size={24} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Headline / Name</label>
                    <Input 
                      required 
                      value={formData.name || formData.title || ""} 
                      onChange={(e) => setFormData({...formData, name: e.target.value, title: e.target.value})}
                      className="rounded-2xl h-12"
                    />
                  </div>
                  {collectionName === 'site_content' && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Headline Italic (Optional)</label>
                      <Input 
                        value={formData.titleItalic || ""} 
                        onChange={(e) => setFormData({...formData, titleItalic: e.target.value})}
                        className="rounded-2xl h-12"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Type / Badge / Category</label>
                    <Input 
                      value={formData.type || formData.badge || formData.category || ""} 
                      onChange={(e) => setFormData({...formData, type: e.target.value, badge: e.target.value, category: e.target.value})}
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> Image URL
                  </label>
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-secondary/30 shrink-0 border">
                      {(formData.imageUrl || formData.url) && <Image src={formData.imageUrl || formData.url} alt="" fill className="object-cover" />}
                    </div>
                    <Input 
                      value={formData.imageUrl || formData.url || ""} 
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value, url: e.target.value})}
                      placeholder="https://..."
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Description / Subtitle / Content</label>
                <Textarea 
                  required
                  value={formData.description || formData.subtitle || formData.content || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value, subtitle: e.target.value, content: e.target.value})}
                  className="rounded-2xl min-h-[150px]"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 h-14 rounded-2xl font-bold text-lg">
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
              <TableHead className="font-bold py-6">Category</TableHead>
              <TableHead className="text-right font-bold py-6 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities && filteredEntities.length > 0 ? filteredEntities.map((entity) => (
              <TableRow key={entity.id} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-bold py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary/30 border">
                      {(entity.imageUrl || entity.url) && <Image src={entity.imageUrl || entity.url} alt="" fill className="object-cover" />}
                    </div>
                    <span>{entity.name || entity.title || entity.email || entity.id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {entity.type || entity.badge || entity.category || "General"}
                  </span>
                </TableCell>
                <TableCell className="text-right py-6 pr-8">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entity)}><Edit2 size={18} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entity.id)}><Trash2 size={18} /></Button>
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
