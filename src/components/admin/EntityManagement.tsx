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
import { Plus, Trash2, Edit2, X, Check, Save, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EntityManagementProps {
  collectionName: string;
}

export function EntityManagement({ collectionName }: EntityManagementProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const entityQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, collectionName), orderBy("createdAt", "desc")) : null
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
      toast({ title: "Updated", description: "The item has been updated successfully." });
    } else {
      data.createdAt = serverTimestamp();
      addDocumentNonBlocking(collection(firestore, collectionName), data);
      toast({ title: "Created", description: "New item added to Rumonge Trails." });
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
    if (!firestore || !window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteDoc(doc(firestore, collectionName, id));
      toast({ title: "Deleted", description: "Item removed from database." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete item." });
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading data...</div>;

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="rounded-xl flex gap-2">
          <Plus size={18} />
          Add New {collectionName.replace(/s$/, '')}
        </Button>
      ) : (
        <Card className="border-none shadow-xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{editingId ? 'Edit' : 'Add New'} {collectionName}</h3>
                <Button type="button" variant="ghost" size="icon" onClick={resetForm}>
                  <X size={20} />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Name / Title</label>
                  <Input 
                    required 
                    value={formData.name || formData.title || ""} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter name..."
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Type / Category</label>
                  <Input 
                    value={formData.type || formData.category || formData.eventType || ""} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    placeholder="e.g. Nature, Festival..."
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                <Textarea 
                  required
                  value={formData.description || formData.content || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Details about this item..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Address / Location</label>
                  <Input 
                    value={formData.address || formData.locationName || ""} 
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Latitude</label>
                  <Input 
                    type="number" step="any"
                    value={formData.latitude || ""} 
                    onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Longitude</label>
                  <Input 
                    type="number" step="any"
                    value={formData.longitude || ""} 
                    onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold flex gap-2">
                <Save size={18} />
                {editingId ? "Update Item" : "Create Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entities && entities.length > 0 ? entities.map((entity) => (
              <TableRow key={entity.id} className="hover:bg-secondary/5 transition-colors">
                <TableCell className="font-bold">{entity.name || entity.title}</TableCell>
                <TableCell>{entity.type || entity.category || entity.eventType}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{entity.address || entity.locationName || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(entity)}>
                      <Edit2 size={16} className="text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(entity.id)}>
                      <Trash2 size={16} className="text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                  No records found in this collection.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}