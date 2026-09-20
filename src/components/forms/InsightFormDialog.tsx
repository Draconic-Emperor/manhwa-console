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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Character, Insight, InsightType, Manhwa } from "@/lib/codex";
import { INSIGHT_LABEL } from "@/lib/codex";
import { useEnsureAuth } from "@/hooks/use-codex";

const TYPES: InsightType[] = ["theory", "lore", "analysis", "review"];

export function InsightFormDialog({
  open,
  onOpenChange,
  presetCharacterId,
  editing,
  characters,
  manhwaById,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  presetCharacterId?: string | null;
  editing?: Insight | null;
  characters: Character[];
  manhwaById: Map<string, Manhwa>;
}) {
  const isEdit = Boolean(editing);
  const add = useMutation(api.insightMutations.addInsight);
  const remove = useMutation(api.insightMutations.deleteInsight);
  const ensureAuth = useEnsureAuth();

  const [characterId, setCharacterId] = useState("");
  const [type, setType] = useState<InsightType>("theory");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCharacterId(editing?.character_id ?? presetCharacterId ?? "");
      setType(editing?.type ?? "theory");
      setTitle(editing?.title ?? "");
      setContent(editing?.content ?? "");
      setError(null);
    }
  }, [open, editing, presetCharacterId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterId) {
      setError("Choose the character this entry is about.");
      return;
    }
    if (title.trim().length < 4) {
      setError("Give the entry a title (4+ characters).");
      return;
    }
    if (content.trim().length < 30) {
      setError("Share a bit more lore — at least 30 characters.");
      return;
    }
    setSaving(true);
    try {
      await ensureAuth();
      await add({
        character_id: characterId as Insight["character_id"],
        type,
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Insight sealed into the codex.");
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save the insight.");
    } finally {
      setSaving(false);
    }
  };

  const grouped = characters.reduce<Record<string, Character[]>>((acc, c) => {
    const key = manhwaById.get(c.manhwa_id)?.title ?? "Unbound";
    (acc[key] ??= []).push(c);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-surface sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? "Edit insight" : "Share an insight"}
          </DialogTitle>
          <DialogDescription>
            Theories, lore breakdowns, reviews — add your knowledge to the codex.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="in-char">Character *</Label>
            <Select value={characterId || undefined} onValueChange={setCharacterId}>
              <SelectTrigger id="in-char" className="w-full">
                <SelectValue placeholder="Choose a character" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                {Object.entries(grouped).map(([seriesTitle, list]) => (
                  <SelectGroup key={seriesTitle}>
                    <SelectLabel>{seriesTitle}</SelectLabel>
                    {list.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="in-type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as InsightType)}>
                <SelectTrigger id="in-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover">
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {INSIGHT_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="in-title">Title *</Label>
              <Input
                id="in-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The debt the Monarch cannot name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="in-content">Your insight *</Label>
            <Textarea
              id="in-content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your theory, analysis, or lore notes…"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-0">
            {isEdit && editing && (
              <Button
                type="button"
                variant="ghost"
                className="text-destructive hover:text-destructive/80"
                disabled={saving}
                onClick={async () => {
                  try {
                    await ensureAuth();
                    await remove({ id: editing._id });
                    toast.success("Insight removed from the chronicle.");
                    onOpenChange(false);
                  } catch {
                    toast.error("Failed to remove the insight.");
                  }
                }}
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="btn-amethyst">
              {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isEdit ? "Save changes" : "Seal insight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
