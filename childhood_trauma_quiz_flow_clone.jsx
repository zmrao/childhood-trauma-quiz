import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, ChevronLeft, ChevronRight, HeartHandshake, Brain, ScanSearch, Sparkles } from "lucide-react";

const quizSteps = [
  {
    id: "age",
    title: "First, tell us your age range",
    description: "We use this to tailor wording and benchmark ranges.",
    type: "radio",
    options: [
      { value: "18_24", label: "18–24" },
      { value: "25_34", label: "25–34" },
      { value: "35_44", label: "35–44" },
      { value: "45_54", label: "45–54" },
      { value: "55_plus", label: "55+" },
    ],
  },
  {
    id: "gender",
    title: "How do you identify?",
    description: "Used only for personalizing the experience.",
    type: "radio",
    options: [
      { value: "woman", label: "Woman" },
      { value: "man", label: "Man" },
      { value: "nonbinary", label: "Non-binary" },
      { value: "prefer_not", label: "Prefer not to say" },
    ],
  },
  {
    id: "imageReaction",
    title: "What do you notice first in this image?",
    description: "Visual projection questions are often used to personalize quiz framing.",
    type: "image-choice",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    options: [
      { value: "face", label: "A face" },
      { value: "forest", label: "The forest/background" },
      { value: "path", label: "A path/opening" },
      { value: "light", label: "The light/contrast" },
    ],
  },
  {
    id: "conflict",
    title: "When conflict happens, what feels most familiar?",
    description: "Pick the response that sounds most like your automatic reaction.",
    type: "radio",
    options: [
      { value: "withdraw", label: "I shut down or withdraw" },
      { value: "people_please", label: "I try to keep everyone happy" },
      { value: "defend", label: "I become defensive quickly" },
      { value: "numb", label: "I feel detached or numb" },
    ],
  },
  {
    id: "childhoodSafety",
    title: "Growing up, home felt…",
    description: "Choose the option closest to your overall experience.",
    type: "radio",
    options: [
      { value: "safe", label: "Mostly safe and predictable" },
      { value: "mixed", label: "Mixed—good moments, but unstable" },
      { value: "tense", label: "Often tense or emotionally unsafe" },
      { value: "chaotic", label: "Chaotic, frightening, or neglectful" },
    ],
  },
  {
    id: "coping",
    title: "Which coping style sounds most like you today?",
    description: "These patterns often connect to earlier experiences.",
    type: "radio",
    options: [
      { value: "hyper_independent", label: "Hyper-independent" },
      { value: "approval", label: "Need reassurance or approval" },
      { value: "overachieve", label: "Overachieve to feel secure" },
      { value: "avoidant", label: "Avoid emotions and difficult topics" },
    ],
  },
  {
    id: "closeness",
    title: "In close relationships, what feels hardest?",
    description: "Choose the answer that feels most true when things get emotionally close.",
    type: "radio",
    options: [
      { value: "distance", label: "Feeling distance and wondering if something is wrong" },
      { value: "guard", label: "Letting my guard down and depending on someone" },
      { value: "tension", label: "Relaxing once tension or conflict appears" },
      { value: "needs", label: "Explaining what I need in the moment" },
    ],
  },
  {
    id: "support",
    title: "When you need support, what usually happens first?",
    description: "Pick the response that shows up most automatically.",
    type: "radio",
    options: [
      { value: "hesitate", label: "I hesitate and tell myself it is not a big deal" },
      { value: "worry", label: "I ask, then worry I asked for too much" },
      { value: "self_handle", label: "I decide it is easier to handle it alone" },
      { value: "scan", label: "I read tone carefully before saying anything" },
    ],
  },
  {
    id: "pressure",
    title: "When life feels overwhelming, what do you lean on most?",
    description: "These patterns often show what your system learned to trust.",
    type: "radio",
    options: [
      { value: "connection", label: "Reassurance from someone close to me" },
      { value: "planning", label: "Plans, structure, and staying ahead" },
      { value: "checking", label: "Staying alert and checking for problems" },
      { value: "shutdown", label: "Pulling back and going emotionally quiet" },
    ],
  },
  {
    id: "email",
    title: "Where should we send your full results?",
    description: "We’ll reveal your strongest pattern on the next screen too.",
    type: "email",
  },
];

const quizQuestionCount = quizSteps.filter((step) => step.type !== "email").length;

const initialAnswers = quizSteps.reduce((acc, step) => {
  acc[step.id] = "";
  return acc;
}, {});

const paywallOffer = {
  name: "Full Pattern Report",
  price: "$19",
  billingNote: "One-time payment",
  guarantee: "Instant access after checkout",
  includes: [
    "Primary trauma-response pattern",
    "Expanded interpretation and behavior notes",
    "Personalized next-step guidance",
  ],
};

function isStepComplete(step, value) {
  if (step.type === "email") {
    return /\S+@\S+\.\S+/.test(value);
  }
  return Boolean(value);
}

function calculateResult(answers) {
  const scores = {
    abandonment: 0,
    hypervigilance: 0,
    emotionalNeglect: 0,
    controlProtection: 0,
  };

  if (answers.imageReaction === "face") scores.abandonment += 2;
  if (answers.imageReaction === "forest") scores.emotionalNeglect += 2;
  if (answers.imageReaction === "path") scores.controlProtection += 2;
  if (answers.imageReaction === "light") scores.hypervigilance += 2;

  if (answers.conflict === "withdraw") scores.emotionalNeglect += 3;
  if (answers.conflict === "people_please") scores.abandonment += 3;
  if (answers.conflict === "defend") scores.hypervigilance += 3;
  if (answers.conflict === "numb") scores.emotionalNeglect += 2;

  if (answers.childhoodSafety === "safe") scores.controlProtection += 1;
  if (answers.childhoodSafety === "mixed") scores.abandonment += 2;
  if (answers.childhoodSafety === "tense") scores.hypervigilance += 3;
  if (answers.childhoodSafety === "chaotic") {
    scores.hypervigilance += 2;
    scores.emotionalNeglect += 2;
  }

  if (answers.coping === "hyper_independent") scores.controlProtection += 3;
  if (answers.coping === "approval") scores.abandonment += 3;
  if (answers.coping === "overachieve") scores.controlProtection += 2;
  if (answers.coping === "avoidant") scores.emotionalNeglect += 3;

  if (answers.closeness === "distance") scores.abandonment += 3;
  if (answers.closeness === "guard") scores.controlProtection += 3;
  if (answers.closeness === "tension") scores.hypervigilance += 3;
  if (answers.closeness === "needs") scores.emotionalNeglect += 3;

  if (answers.support === "hesitate") scores.emotionalNeglect += 2;
  if (answers.support === "worry") scores.abandonment += 2;
  if (answers.support === "self_handle") scores.controlProtection += 3;
  if (answers.support === "scan") scores.hypervigilance += 2;

  if (answers.pressure === "connection") scores.abandonment += 2;
  if (answers.pressure === "planning") scores.controlProtection += 2;
  if (answers.pressure === "checking") scores.hypervigilance += 3;
  if (answers.pressure === "shutdown") scores.emotionalNeglect += 3;

  const resultMap = {
    abandonment: {
      title: "Abandonment Sensitivity",
      subtitle: "You may crave reassurance and feel especially alert to distance or rejection.",
      summary:
        "This pattern can form when consistency, closeness, or emotional repair felt uncertain. It often shows up as overthinking tone, seeking reassurance, or fearing people will pull away.",
      tips: [
        "Notice when your mind fills in rejection before evidence is clear.",
        "Practice asking directly for clarity instead of over-interpreting silence.",
        "Build safety through consistent routines and reciprocal relationships.",
      ],
    },
    hypervigilance: {
      title: "Hypervigilance Pattern",
      subtitle: "Your nervous system may stay on guard even when you want to relax.",
      summary:
        "This often develops when unpredictability or tension taught you to scan for danger. It can appear as defensiveness, over-reading situations, or difficulty feeling fully safe.",
      tips: [
        "Track the body cues that signal you’re bracing for danger.",
        "Use grounding practices before hard conversations.",
        "Create environments with more predictability and clear boundaries.",
      ],
    },
    emotionalNeglect: {
      title: "Emotional Neglect Pattern",
      subtitle: "You may have learned to downplay needs, emotions, or vulnerability.",
      summary:
        "When feelings were ignored, minimized, or unsupported, people often adapt by disconnecting from needs. Later this can look like numbness, avoidance, or trouble naming what you feel.",
      tips: [
        "Pause and label emotions with simple words before trying to solve them.",
        "Practice expressing one small need clearly each day.",
        "Look for relationships where your inner world is welcomed, not minimized.",
      ],
    },
    controlProtection: {
      title: "Control-as-Protection Pattern",
      subtitle: "You may cope by staying highly capable, prepared, or self-reliant.",
      summary:
        "This pattern often forms when being organized, strong, or high-functioning felt safer than depending on others. It can bring success, but also pressure and difficulty softening.",
      tips: [
        "Notice where control is helping versus where it’s exhausting you.",
        "Experiment with small acts of trust and delegation.",
        "Let support count even when it isn’t perfect.",
      ],
    },
  };

  const [topKey] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return {
    key: topKey,
    ...resultMap[topKey],
    scores,
    completionScore: Math.min(
      96,
      58 + Object.values(answers).filter(Boolean).length * 6
    ),
  };
}

function AmbientFigures({ intensity = "default" }) {
  const glowClass =
    intensity === "strong"
      ? "bg-primary/20 blur-3xl"
      : "bg-primary/12 blur-3xl";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className={`absolute -left-16 top-12 h-40 w-40 rounded-full ${glowClass}`}
        animate={{ x: [0, 18, 0], y: [0, -12, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-3rem] top-24 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl"
        animate={{ x: [0, -22, 0], y: [0, 16, 0], scale: [1, 0.94, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-4rem] left-1/3 h-48 w-48 rounded-full bg-amber-200/8 blur-3xl"
        animate={{ x: [0, 10, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-20 top-10 h-24 w-24 rounded-[2rem] border border-white/8 bg-white/5"
        animate={{ rotate: [0, 8, 0], y: [0, 12, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 left-14 h-14 w-14 rounded-full border border-white/10"
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function StepRenderer({ step, value, setValue }) {
  if (step.type === "radio") {
    return (
      <RadioGroup value={value} onValueChange={setValue} className="grid gap-4 pt-2">
        {step.options.map((option) => (
          <motion.label
            key={option.value}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * step.options.indexOf(option), duration: 0.28 }}
            className={`group flex cursor-pointer items-center gap-4 rounded-[1.6rem] border p-5 transition duration-200 ${
              value === option.value
                ? "border-primary bg-primary/10 shadow-[0_12px_40px_rgba(249,115,22,0.14)]"
                : "border-border/80 bg-background/65 hover:border-primary/40 hover:bg-white/[0.03]"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-semibold transition ${
                value === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-muted/50 text-muted-foreground group-hover:border-primary/35"
              }`}
            >
              {step.options.indexOf(option) + 1}
            </div>
            <div className="text-sm leading-6 md:text-base">{option.label}</div>
            <RadioGroupItem value={option.value} id={option.value} className="ml-auto" />
          </motion.label>
        ))}
      </RadioGroup>
    );
  }

  if (step.type === "image-choice") {
    return (
      <div className="space-y-4 pt-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-hidden rounded-[2rem] border border-border/80 bg-muted/60 shadow-xl"
        >
          <img src={step.image} alt="Quiz prompt" className="h-72 w-full object-cover" />
        </motion.div>
        <div className="mb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">Choose what stands out first</div>
        <div className="grid gap-4 sm:grid-cols-2">
          {step.options.map((option, idx) => (
            <motion.button
              key={option.value}
              onClick={() => setValue(option.value)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * idx, duration: 0.28 }}
              className={`rounded-[1.6rem] border p-5 text-left transition duration-200 ${
                value === option.value
                  ? "border-primary bg-primary/10 shadow-[0_12px_40px_rgba(249,115,22,0.14)]"
                  : "border-border/80 bg-background/65 hover:border-primary/40 hover:bg-white/[0.03]"
              }`}
            >
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Option {idx + 1}</div>
              <div className="mt-2 text-base font-medium">{option.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (step.type === "email") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-border/80 bg-background/65 p-6"
      >
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="you@example.com"
          className="mt-3 h-14 rounded-2xl bg-background/80"
        />
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          This demo simulates the capture step only. No payment or real submission is wired up.
        </p>
      </motion.div>
    );
  }

  return null;
}

export default function ChildhoodTraumaQuizClone() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [view, setView] = useState("intro");
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const currentStep = quizSteps[stepIndex];
  const progress = ((stepIndex + 1) / quizSteps.length) * 100;
  const result = useMemo(() => calculateResult(answers), [answers]);

  const canContinue = useMemo(() => {
    const value = answers[currentStep.id];
    return isStepComplete(currentStep, value);
  }, [answers, currentStep]);

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const updatePaymentDetails = (key, value) => {
    setPaymentDetails((prev) => ({ ...prev, [key]: value }));
  };

  const canPurchase = useMemo(() => {
    return Object.values(paymentDetails).every(Boolean);
  }, [paymentDetails]);

  const handleNext = () => {
    if (!canContinue) return;
    if (stepIndex < quizSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setView("checkout");
    }
  };

  const handleBack = () => {
    if (view === "checkout") {
      setView("quiz");
      return;
    }
    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
  };

  if (view === "intro") {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.2),_transparent_30%),linear-gradient(180deg,_hsl(var(--background)),_hsl(222_26%_6%))] p-6 md:p-10">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <Card className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-muted/30 shadow-2xl backdrop-blur">
              <AmbientFigures intensity="strong" />
              <div className="relative p-8 text-center md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  <HeartHandshake className="h-4 w-4" /> Childhood pattern quiz
                </div>
                <h1 className="mx-auto mt-8 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
                  Discover the pattern beneath your reactions
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                  Answer a short series of guided questions and unlock your personalized pattern report at the end.
                </p>

                <div className="mx-auto mt-12 max-w-xl rounded-[2rem] border border-primary/30 bg-primary/12 p-6 shadow-[0_0_0_1px_rgba(249,115,22,0.08),0_24px_60px_rgba(249,115,22,0.22)] md:p-8">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Ready to begin
                  </div>
                  <div className="mt-3 text-sm leading-6 text-muted-foreground">
                    {quizQuestionCount} focused questions. One screen at a time.
                  </div>
                  <Button
                    onClick={() => setView("quiz")}
                    className="mt-8 h-16 w-full rounded-2xl text-lg font-semibold shadow-xl shadow-primary/30"
                  >
                    Start quiz now <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 p-6 md:p-10">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="overflow-hidden rounded-[2rem] border-0 shadow-xl">
              <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
                <div className="p-8 md:p-10">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <CheckCircle2 className="h-4 w-4" /> Results unlocked
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{result.title}</h1>
                  <p className="mt-3 text-lg text-muted-foreground">{result.subtitle}</p>
                  <p className="mt-6 text-sm leading-6 text-muted-foreground md:text-base">{result.summary}</p>

                  <div className="mt-8 grid gap-4">
                    {result.tips.map((tip, idx) => (
                      <div key={idx} className="rounded-2xl border bg-muted/30 p-4">
                        <div className="text-sm font-medium">Next step {idx + 1}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{tip}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/40 p-8 md:p-10">
                  <div className="rounded-3xl border bg-background p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold">Profile confidence</div>
                        <div className="text-sm text-muted-foreground">Based on your response pattern</div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Match score</span>
                        <span>{result.completionScore}%</span>
                      </div>
                      <Progress value={result.completionScore} className="h-3" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border bg-background p-6 shadow-sm">
                    <div className="text-sm font-semibold">What this demo recreates</div>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>Multi-step quiz flow</li>
                      <li>Image-based question step</li>
                      <li>Email capture gate</li>
                      <li>Checkout-style interstitial</li>
                      <li>Post-purchase results screen logic</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (view === "checkout") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-[2rem] border-0 shadow-xl">
              <CardHeader className="pb-3">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <ScanSearch className="h-4 w-4" /> Analysis ready
                </div>
                <CardTitle className="max-w-2xl text-3xl leading-tight md:text-4xl">
                  Unlock your full results and next-step plan
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6 md:text-base">
                  Your analysis is ready. Complete checkout to view your full profile, guidance, and recommended next steps.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 p-6 pt-0 md:grid-cols-[minmax(0,1fr)_320px] md:p-8 md:pt-0">
                <div className="space-y-4">
                  <div className="rounded-3xl border bg-background p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-base font-semibold">{paywallOffer.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {paywallOffer.billingNote} • {paywallOffer.guarantee}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-3xl font-semibold leading-none">{paywallOffer.price}</div>
                      </div>
                    </div>
                    <ul className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                      {paywallOffer.includes.map((item) => (
                        <li key={item} className="rounded-2xl bg-muted/40 px-4 py-3 leading-5">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-3xl border bg-background p-5">
                    <div className="text-sm font-semibold">Contact email</div>
                    <div className="mt-2 text-sm text-muted-foreground">{answers.email || "No email entered"}</div>
                  </div>
                  <div className="rounded-3xl border bg-background p-5">
                    <div className="text-sm font-semibold">Payment details</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      Use any values for the demo. Nothing is processed.
                    </div>
                    <div className="mt-4 grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on card</Label>
                        <Input
                          id="cardName"
                          value={paymentDetails.cardName}
                          onChange={(e) => updatePaymentDetails("cardName", e.target.value)}
                          placeholder="Jordan Lee"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card number</Label>
                        <Input
                          id="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => updatePaymentDetails("cardNumber", e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry</Label>
                          <Input
                            id="expiry"
                            value={paymentDetails.expiry}
                            onChange={(e) => updatePaymentDetails("expiry", e.target.value)}
                            placeholder="12/28"
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            value={paymentDetails.cvc}
                            onChange={(e) => updatePaymentDetails("cvc", e.target.value)}
                            placeholder="123"
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Button variant="outline" onClick={handleBack} className="rounded-xl sm:flex-1">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      onClick={() => setView("results")}
                      disabled={!canPurchase}
                      className="rounded-xl sm:flex-1"
                    >
                      <span className="truncate">Unlock full report {paywallOffer.price}</span>
                      <ChevronRight className="ml-2 h-4 w-4 shrink-0" />
                    </Button>
                  </div>
                  <p className="text-center text-xs leading-5 text-muted-foreground sm:text-left">
                    Demo only. This paywall does not connect to a real payment processor yet.
                  </p>
                </div>

                <div className="rounded-3xl border bg-muted/30 p-6">
                  <div className="text-sm font-semibold">Order summary</div>
                  <div className="mt-4 rounded-2xl bg-background p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Product</div>
                        <div className="text-lg font-semibold leading-6">{paywallOffer.name}</div>
                      </div>
                      <div className="shrink-0 text-right text-xl font-semibold">{paywallOffer.price}</div>
                    </div>
                    <div className="mt-2 text-sm leading-6 text-muted-foreground">
                      Immediate access to your result profile after checkout.
                    </div>
                    <div className="mt-4 rounded-2xl border bg-muted/30 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Today’s total</span>
                        <span className="font-semibold">{paywallOffer.price}</span>
                      </div>
                      <div className="mt-1 text-xs leading-5 text-muted-foreground">
                        {paywallOffer.billingNote}. No subscription in this demo.
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Analysis completion</span>
                        <span>{result.completionScore}%</span>
                      </div>
                      <Progress value={result.completionScore} className="h-2.5" />
                    </div>
                    <div className="mt-4 rounded-2xl border bg-muted/30 p-4">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Preview</div>
                      <div className="mt-2 font-medium leading-6">{result.title}</div>
                      <div className="mt-1 text-sm leading-6 text-muted-foreground">{result.subtitle}</div>
                    </div>
                    <div className="mt-4 rounded-2xl border bg-background p-4">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Why people buy</div>
                      <div className="mt-2 text-sm leading-6 text-muted-foreground">
                        Clear language, a fast summary, and next steps you can act on right away.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_24%),linear-gradient(180deg,_hsl(var(--background)),_hsl(222_26%_6%))] p-6 md:p-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <Card className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-muted/25 shadow-2xl backdrop-blur">
            <AmbientFigures />
            <CardHeader className="relative border-b border-border/70 p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    <HeartHandshake className="h-4 w-4" /> Childhood pattern quiz
                  </div>
                  <CardTitle className="text-3xl leading-tight md:text-4xl">{currentStep.title}</CardTitle>
                  <CardDescription className="mt-3 max-w-xl text-sm leading-6 md:text-base">
                    {currentStep.description}
                  </CardDescription>
                </div>
                <div className="shrink-0 text-right text-sm text-muted-foreground">
                  Step {stepIndex + 1} of {quizSteps.length}
                </div>
              </div>
              <div className="pt-5">
                <Progress value={progress} className="h-2.5" />
              </div>
            </CardHeader>
            <CardContent className="relative p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="min-h-[340px]"
                >
                  <StepRenderer
                    step={currentStep}
                    value={answers[currentStep.id]}
                    setValue={(value) => updateAnswer(currentStep.id, value)}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  className="rounded-xl"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext} disabled={!canContinue} className="rounded-xl px-6">
                  {stepIndex === quizSteps.length - 1 ? "Continue to checkout" : "Next question"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
