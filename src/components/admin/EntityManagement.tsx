"use client";

import React, { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
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

    // Process array fields like specialties
    const processedData = { ...formData };
    if (processedData.specialties && typeof processedData.specialties === 'string') {
      processedData.specialties = processedData.specialties.split(',').map((s: string) => s.trim());
    }

    const data = {
      ...processedData,
      updatedAt: serverTimestamp(),
    };

    if (editingId) {
      updateDocumentNonBlocking(doc(firestore, collectionName, editingId), data);
      toast({ title: "Updated", description: "The record has been updated successfully." });
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
    const editData = { ...entity };
    // Convert arrays back to strings for form inputs
    if (Array.isArray(editData.specialties)) {
      editData.specialties = editData.specialties.join(', ');
    }
    setFormData(editData);
    setEditingId(entity.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(firestore, collectionName, id));
      toast({ title: "Deleted", description: "Record removed from database." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete record." });
    }
  };

  const filteredEntities = entities?.filter(e => {
    const name = (e.name || e.title || e.email || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Loader2 className="animate-spin text-primary w-12 h-12" />
      <p className="text-muted-foreground font-bold animate-pulse">Synchronizing with Rumonge Database...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="rounded-xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
            <Plus size={20} className="mr-2" />
            Add New {collectionName.replace(/([A-Z])/g, ' $1').trim().replace(/s$/, '')}
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
                  <h3 className="font-headline text-3xl font-bold">{editingId ? 'Refine' : 'Add'} <span className="text-primary italic">Record</span></h3>
                  <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">{collectionName}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={resetForm} className="rounded-full">
                  <X size={24} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Identity Fields */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Name / Title</label>
                    <Input 
                      required 
                      value={formData.name || formData.title || ""} 
                      onChange={(e) => setFormData({...formData, name: e.target.value, title: e.target.value})}
                      placeholder="Enter name..."
                      className="rounded-2xl h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Type / Category</label>
                    <Input 
                      value={formData.type || formData.category || formData.eventType || ""} 
                      onChange={(e) => setFormData({...formData, type: e.target.value, category: e.target.value, eventType: e.target.value})}
                      placeholder="e.g. Natural Wonder, Festival, Hotel..."
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>

                {/* Media Preview & URL */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                    <ImageIcon size={14} /> Image URL (Replace to change image)
                  </label>
                  <div className="flex gap-4">
                    <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-secondary/30 shrink-0 border">
                      {formData.imageUrl ? (
                        <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <ImageIcon size={32} />
                        </div>
                      )}
                    </div>
                    <Input 
                      value={formData.imageUrl || ""} 
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://images.unsplash.com/..."
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Description / Detailed Info</label>
                <Textarea 
                  required
                  value={formData.description || formData.content || formData.history || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value, content: e.target.value, history: e.target.value})}
                  placeholder="Tell the story of this record..."
                  className="rounded-2xl min-h-[150px] text-lg font-body"
                />
              </div>

              {/* Dynamic Contextual Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 bg-secondary/20 rounded-[2rem]">
                {/* Location Fields */}
                {(['wonderAttractions', 'accommodations', 'localCuisineSpots', 'events'].includes(collectionName)) && (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Address / Location Name</label>
                      <Input 
                        value={formData.address || formData.locationName || ""} 
                        onChange={(e) => setFormData({...formData, address: e.target.value, locationName: e.target.value})}
                        className="rounded-xl h-10 bg-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Latitude</label>
                      <Input 
                        type="number" step="any"
                        value={formData.latitude || ""} 
                        onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                        className="rounded-xl h-10 bg-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Longitude</label>
                      <Input 
                        type="number" step="any"
                        value={formData.longitude || ""} 
                        onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                        className="rounded-xl h-10 bg-white"
                      />
                    </div>
                  </>
                )}

                {/* Rating & Pricing */}
                {(['wonderAttractions', 'accommodations', 'localCuisineSpots'].includes(collectionName)) && (
                   <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Rating (1-5)</label>
                    <Input 
                      type="number" step="0.1" max="5" min="1"
                      value={formData.rating || ""} 
                      onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                      className="rounded-xl h-10 bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30">
                  <Save size={20} className="mr-2" />
                  {editingId ? "Commit Changes" : "Create New Record"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="h-14 rounded-2xl px-8 border-2">
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
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-foreground py-6 pl-8">Identity</TableHead>
              <TableHead className="font-bold text-foreground py-6">Category</TableHead>
              <TableHead className="hidden lg:table-cell font-bold text-foreground py-6">Description Snippet</TableHead>
              <TableHead className="text-right font-bold text-foreground py-6 px-8">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities && filteredEntities.length > 0 ? filteredEntities.map((entity) => (
              <TableRow key={entity.id} className="hover:bg-primary/5 transition-colors border-b-secondary/20">
                <TableCell className="font-bold py-6 pl-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary/30 border">
                      {entity.imageUrl && <Image src={entity.imageUrl} alt="" fill className="object-cover" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg">{entity.name || entity.title || entity.email}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">ID: {entity.id.slice(0, 8)}...</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/20">
                    {entity.type || entity.category || entity.eventType || "General"}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground max-w-sm truncate py-6 font-body">
                  {entity.description || entity.content || entity.address || "No description provided."}
                </TableCell>
                <TableCell className="text-right py-6 pr-8">
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEdit(entity)}
                      className="rounded-full hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(entity.id)}
                      className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-32">
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Database size={48} className="opacity-20" />
                    <p className="font-headline text-2xl italic">No records found in Firestore.</p>
                    <p className="text-sm max-w-md mx-auto">Use the <b>Seed Initial Data</b> button in the sidebar to populate all collections with Rumonge content.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
