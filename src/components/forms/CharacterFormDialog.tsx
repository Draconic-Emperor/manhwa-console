import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Character, Manhwa } from "@/lib/codex";
import { useEnsureAuth } from "@/hooks/use-codex";

type Errors = Partial<Record<"name" | "role" | "description" | "rank" | "series" | "image", string>>;

export function CharacterFormDialog({
  open,
  onOpenChange,
  character,
  presetManhwaId,
  manhwaList,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  character?: Character | null;
  presetManhwaId?: string | null;
  manhwaList: Manhwa[];
}) {
  const editing = Boolean(character);
  const save = useMutation(api.characterMutations.saveCharacter);
  const ensureAuth = useEnsureAuth();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [manhwaId, setManhwaId] = useState<string>("");
  const [rank, setRank] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(character?.name ?? "");
      setRole(character?.role ?? "");
      setManhwaId(character?.manhwa_id ?? presetManhwaId ?? "");
      setRank(character ? String(character.rank) : "");
      setImage(character?.image_url ?? "");
      setDescription(character?.description ?? "");
      setErrors({});
    }
  }, [open, character, presetManhwaId]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Every hero needs a name (2+ characters).";
    if (role.trim().length < 2) next.role = "Give them a role (e.g. Protagonist).";
    if (!manhwaId) next.series = "Bind them to a series.";
    if (description.trim().length < 20) next.description = "Describe them in at least a sentence (20+ characters).";
    if (rank.trim() !== "") {
      const n = Number(rank);
      if (!Number.isInteger(n) || n < 1 || n > 999) next.rank = "Rank must be a whole number between 1 and 999.";
    }
    if (image.trim() && !/^https?:\/\//i.test(image.trim())) next.image = "Portrait must be an http(s) image URL, or leave empty for arcane art.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await ensureAuth();
      await save({
        id: character?._id,
        name: name.trim(),
        role: role.trim(),
        description: description.trim(),
        rank: rank.trim() === "" ? 999 : Number(rank),
        image_url: image.trim() || undefined,
        manhwa_id: manhwaId as Character["manhwa_id"],
      });
      toast.success(editing ? "Character updated in the codex." : "Character cataloged in the codex.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save the character.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{editing ? "Edit character" : "Catalog a character"}</DialogTitle>
          <DialogDescription>
            {editing ? "Amend the record for this character." : "Add a character to a series in the archive."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ch-name">Name *</Label>
              <Input
                id="ch-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sera Vael"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <p className="text-xs text-rose-300">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ch-role">Role *</Label>
              <Input
                id="ch-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Protagonist"
                aria-invalid={Boolean(errors.role)}
              />
              {errors.role && <p className="text-xs text-rose-300">{errors.role}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ch-series">Series *</Label>
              <Select value={manhwaId || undefined} onValueChange={(v) => setManhwaId(v)}>
                <SelectTrigger id="ch-series" className="w-full" aria-invalid={Boolean(errors.series)}>
                  <SelectValue placeholder="Choose a series" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  {manhwaList.map((m) => (
                    <SelectItem key={m._id} value={m._id}>
                      {m.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.series && <p className="text-xs text-rose-300">{errors.series}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ch-rank">Rank</Label>
              <Input
                id="ch-rank"
                inputMode="numeric"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="1 (strongest) – 999"
                aria-invalid={Boolean(errors.rank)}
              />
              {errors.rank && <p className="text-xs text-rose-300">{errors.rank}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ch-image">Portrait URL</Label>
            <Input
              id="ch-image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://… (leave empty for arcane art)"
              aria-invalid={Boolean(errors.image)}
            />
            {errors.image ? (
              <p className="text-xs text-rose-300">{errors.image}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Leave empty and the codex conjures its own portrait.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ch-desc">Description *</Label>
            <Textarea
              id="ch-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Who are they, and what power do they carry?"
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <p className="text-xs text-rose-300">{errors.description}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="btn-arcane">
              {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {editing ? "Save changes" : "Catalog character"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
