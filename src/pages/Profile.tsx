import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sparkles, Loader2, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateRoutine, type Routine } from "@/lib/routine";
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
import { Skeleton } from "@/components/ui/skeleton";

const SKIN_TYPES = ["Normal", "Dry", "Oily", "Combination", "Sensitive"];
const HAIR_TYPES = ["Straight", "Wavy", "Curly", "Coily", "Fine", "Thick"];

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skinType, setSkinType] = useState<string>("");
  const [hairType, setHairType] = useState<string>("");
  const [concerns, setConcerns] = useState("");
  const [allergies, setAllergies] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [routine, setRoutine] = useState<Routine | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("skin_type, hair_type, concerns, allergies")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        toast.error(`Could not load profile: ${error.message}`);
      } else if (data) {
        setSkinType(data.skin_type ?? "");
        setHairType(data.hair_type ?? "");
        setConcerns(data.concerns ?? "");
        setAllergies(data.allergies ?? "");
        // Profile counts as saved if any field is non-empty
        if (data.skin_type || data.hair_type || data.concerns || data.allergies) {
          setProfileSaved(true);
        }
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!skinType && !hairType && !concerns && !allergies) {
      toast.error("Please fill in at least one field.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      skin_type: skinType || null,
      hair_type: hairType || null,
      concerns: concerns || null,
      allergies: allergies || null,
    });
    setSaving(false);
    if (error) {
      toast.error(`Could not save profile: ${error.message}`);
      return;
    }
    setProfileSaved(true);
    toast.success("Profile saved");
  };

  const handleGenerate = () => {
    if (!profileSaved) {
      toast.error("Please save your profile first.");
      return;
    }
    setGenerating(true);
    setRoutine(null);
    // Brief delay for UX feedback, then run pure rule-based generator
    setTimeout(() => {
      try {
        const result = generateRoutine({ skinType, hairType, concerns, allergies });
        setRoutine(result);
        toast.success("Your personalized routine is ready");
      } catch (err) {
        toast.error(
          `Could not generate routine: ${err instanceof Error ? err.message : "Unknown error"}`,
        );
      } finally {
        setGenerating(false);
      }
    }, 250);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between h-20 px-4">
          <div>
            <p className="text-gold tracking-[0.3em] text-xs uppercase">Lumière</p>
            <h1 className="font-serif text-xl">Profile</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-foreground/80 hover:text-gold">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-gold/50 text-gold hover:bg-gold/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-10">
          <h2 className="font-serif text-3xl md:text-4xl mb-2">
            Your Beauty <span className="text-gold">Profile</span>
          </h2>
          <p className="text-muted-foreground">
            Tell us about your skin and hair so we can personalize your experience.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8 space-y-6"
        >
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input value={user?.email ?? ""} disabled className="bg-muted/40" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="skin">Skin type</Label>
                  <Select value={skinType} onValueChange={setSkinType}>
                    <SelectTrigger id="skin">
                      <SelectValue placeholder="Select skin type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SKIN_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hair">Hair type</Label>
                  <Select value={hairType} onValueChange={setHairType}>
                    <SelectTrigger id="hair">
                      <SelectValue placeholder="Select hair type" />
                    </SelectTrigger>
                    <SelectContent>
                      {HAIR_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="concerns">Skin concerns</Label>
                <Textarea
                  id="concerns"
                  value={concerns}
                  onChange={(e) => setConcerns(e.target.value)}
                  placeholder="e.g. acne, dark spots, fine lines"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. fragrance, nuts, lanolin"
                  rows={2}
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </>
          )}
        </form>

        {/* AI Routine */}
        <section className="mt-10 rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-2xl">Your Beauty Routine</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized morning &amp; evening rituals based on your profile.
                </p>
              </div>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating || loading || !profileSaved}
              className="bg-gold text-primary-foreground hover:bg-gold-bright shadow-gold disabled:opacity-50"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate My Routine
                </>
              )}
            </Button>
          </div>

          {routine ? (
            <div className="grid md:grid-cols-2 gap-5">
              <RoutineCard
                title="Morning"
                icon={<Sun className="h-5 w-5 text-gold" />}
                steps={routine.morning}
              />
              <RoutineCard
                title="Evening"
                icon={<Moon className="h-5 w-5 text-gold" />}
                steps={routine.evening}
              />
              {routine.notes && (
                <div className="md:col-span-2 rounded-xl border border-gold/30 bg-gold/5 p-4">
                  <p className="text-sm text-foreground/85">
                    <span className="text-gold font-medium">Note · </span>
                    {routine.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {profileSaved
                ? "Click Generate to create a routine tailored to your skin, hair, concerns, and allergies."
                : "Save your profile first to unlock your personalized routine."}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

const RoutineCard = ({
  title,
  icon,
  steps,
}: {
  title: string;
  icon: React.ReactNode;
  steps: string[];
}) => (
  <div className="rounded-xl border border-border/60 bg-surface-elevated p-5">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h4 className="font-serif text-xl">{title}</h4>
    </div>
    <ol className="space-y-2.5">
      {steps?.map((step, i) => (
        <li key={i} className="flex gap-3 text-sm text-foreground/85">
          <span className="text-gold font-serif text-lg leading-none mt-0.5">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  </div>
);

export default Profile;
