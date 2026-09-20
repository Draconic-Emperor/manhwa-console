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
import type { Manhwa } from "@/lib/codex";
import { useEnsureAuth } from "@/hooks/use-codex";

type Errors = Partial<Record<"title" | "author" | "description" | "rank" | "cover", string>>;

export function ManhwaFormDialog({
  open,
  onOpenChange,
  manhwa,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  manhwa?: Manhwa | null;
}) {
  const editing = Boolean(manhwa);
  const save = useMutation(api.mutations.saveManhwa);
  const ensureAuth = useEnsureAuth();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<"ongoing" | "completed" | "hiatus">("ongoing");
  const [rank, setRank] = useState("");
  const [genre, setGenre] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(manhwa?.title ?? "");
      setAuthor(manhwa?.author ?? "");
      setStatus(manhwa?.status ?? "ongoing");
      setRank(manhwa ? String(manhwa.rank) : "");
      setGenre(manhwa?.genre ?? "");
      setCover(manhwa?.cover_image ?? "");
      setDescription(manhwa?.description ?? "");
      setErrors({});
    }
  }, [open, manhwa]);

  const validate = (): boolean => {
    const next: Errors = {};
    if (title.trim().length < 2) next.title = "Give the series a name (2+ characters).";
    if (author.trim().length < 2) next.author = "Who wrote it? (2+ characters).";
    if (description.trim().length < 20) next.description = "Add at least a sentence or two of lore (20+ characters).";
    if (rank.trim() !== "") {
      const n = Number(rank);
      if (!Number.isInteger(n) || n < 1 || n > 999) next.rank = "Rank must be a whole number between 1 and 999.";
    }
    if (cover.trim() && !/^https?:\/\//i.test(cover.trim())) next.cover = "Cover must be an http(s) image URL, or leave empty for arcane art.";
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
        id: manhwa?._id,
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        status,
        rank: rank.trim() === "" ? 999 : Number(rank),
        cover_image: cover.trim() || undefined,
        genre: genre.trim() || undefined,
      });
      toast.success(editing ? "Series updated in the codex." : "Series inscribed into the codex.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save the series.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{editing ? "Edit series entry" : "Inscribe a new series"}</DialogTitle>
          <DialogDescription>
            {editing
              ? "Amend the record. The archive remembers every version."
              : "Add a manhwa series to the living archive."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mh-title">Title *</Label>
              <Input
                id="mh-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Shadow Monarch's Descent"
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mh-author">Author *</Label>
              <Input
                id="mh-author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Sung-Hyun Park"
                aria-invalid={Boolean(errors.author)}
              />
              {errors.author && <p className="text-xs text-destructive">{errors.author}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="mh-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger id="mh-status" className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="hiatus">Hiatus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mh-rank">Rank</Label>
              <Input
                id="mh-rank"
                inputMode="numeric"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="1–999"
                aria-invalid={Boolean(errors.rank)}
              />
              {errors.rank && <p className="text-xs text-destructive">{errors.rank}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mh-genre">Genre</Label>
              <Input
                id="mh-genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Action"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mh-cover">Cover image URL</Label>
            <Input
              id="mh-cover"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://… (leave empty for arcane art)"
              aria-invalid={Boolean(errors.cover)}
            />
            {errors.cover ? (
              <p className="text-xs text-destructive">{errors.cover}</p>
            ) : (
              <p className="text-xs text-muted-foreground">Leave empty and the codex conjures its own art.</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mh-desc">Description / lore *</Label>
            <Textarea
              id="mh-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What world does this series open?"
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="btn-amethyst">
              {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {editing ? "Save changes" : "Inscribe series"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
