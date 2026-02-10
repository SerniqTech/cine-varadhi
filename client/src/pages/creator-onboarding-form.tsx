"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  primaryProfession: z
    .array(z.string())
    .min(1, "Select at least one profession"),
  secondarySkills: z.array(z.string()).optional(),
  experienceLevel: z.string().min(1, "Select experience level"),
  yearsOfExperience: z.string().min(1, "Select years of experience"),
  industryTypes: z
    .array(z.string())
    .min(1, "Select at least one industry type"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  portfolioLinks: z.object({
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    vimeo: z.string().optional(),
    website: z.string().optional(),
  }),
  showreelUrl: z.string().optional(),
  currentCity: z.string().min(2, "Enter your current city"),
  travelWillingness: z.string().min(1, "Select travel willingness"),
});

type FormData = z.infer<typeof formSchema>;

const professions = [
  "Actor",
  "Director",
  "Writer",
  "Cinematographer",
  "Editor",
  "Music Director",
  "Singer",
  "Reel Creator",
  "Influencer",
  "Animator / VFX Artist",
  "Designer",
  "Advertiser / Brand",
  "Other",
];

const industries = [
  "Film",
  "Web Series",
  "Short Films",
  "OTT",
  "Advertisements",
  "Reels / Digital Content",
  "Theatre",
  "All",
];

const languages = [
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam",
  "English",
  "Other",
];

export default function CreatorOnboardingForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<FormData>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryProfession: [],
      secondarySkills: [],
      industryTypes: [],
      languages: [],
      portfolioLinks: {},
    },
  });

  const experienceLevel = watch("experienceLevel");
  const yearsOfExperience = watch("yearsOfExperience");
  const travelWillingness = watch("travelWillingness");

  const toggleSelection = (
    item: string,
    selected: string[],
    setSelected: (items: string[]) => void,
    fieldName: keyof FormData,
  ) => {
    const newSelection = selected.includes(item)
      ? selected.filter((i) => i !== item)
      : [...selected, item];
    setSelected(newSelection);
    setValue(fieldName, newSelection as never, { shouldValidate: true });
  };

  const validateStep = async (step: number) => {
    const fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1) {
      fieldsToValidate.push("fullName", "mobileNumber");
    } else if (step === 2) {
      fieldsToValidate.push("primaryProfession");
    } else if (step === 3) {
      fieldsToValidate.push("experienceLevel", "yearsOfExperience");
    } else if (step === 4) {
      fieldsToValidate.push("industryTypes", "languages");
    } else if (step === 6) {
      fieldsToValidate.push("currentCity", "travelWillingness");
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const { data: creatorData, error } = await supabase.rpc(
        "complete_onboarding",
        {
          p_mobile_number: data.mobileNumber,
          p_primary_profession: data.primaryProfession,
          p_secondary_skills: data.secondarySkills,
          p_experience_level: data.experienceLevel,
          p_years_of_experience: data.yearsOfExperience,
          p_industry_types: data.industryTypes,
          p_languages: data.languages,
          p_portfolio_links: data.portfolioLinks,
          p_showreel_url: data.showreelUrl,
          p_current_city: data.currentCity,
          p_travel_willingness: data.travelWillingness,
        },
      );

      if (error) {
        throw error;
      }

      console.log(creatorData);

      alert(
        `Registration successful! Welcome to Cine Varadhi, ${data.fullName}!`,
      );

      navigate("/");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Registration failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-2xl">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all shrink-0 ${
                    currentStep === step
                      ? "bg-primary text-white scale-110"
                      : currentStep > step
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div
                    className={`flex-1 h-1 ${
                      currentStep > step
                        ? "bg-green-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Basic Account Details"}
              {currentStep === 2 && "Professional Identity"}
              {currentStep === 3 && "Experience Details"}
              {currentStep === 4 && "Industry & Work Preferences"}
              {currentStep === 5 && "Portfolio & Work Samples"}
              {currentStep === 6 && "Location & Availability"}
            </CardTitle>
            <CardDescription>
              Step {currentStep} of 6 - Please fill in all required fields
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              autoComplete="off"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Full Name / Stage Name *</Label>
                    <Input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="Enter your name"
                      className="mt-2"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      {...register("mobileNumber")}
                      placeholder="Enter mobile number"
                      className="mt-2"
                    />
                    {errors.mobileNumber && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.mobileNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>Primary Profession *</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Select one or more professions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {professions.map((profession) => (
                        <Badge
                          key={profession}
                          variant={
                            selectedProfessions.includes(profession)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-4 py-2 text-sm hover:scale-105 transition-transform"
                          onClick={() =>
                            toggleSelection(
                              profession,
                              selectedProfessions,
                              setSelectedProfessions,
                              "primaryProfession",
                            )
                          }
                        >
                          {profession}
                        </Badge>
                      ))}
                    </div>
                    {errors.primaryProfession && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.primaryProfession.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Secondary Skills (Optional)</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Select additional skills you possess
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {professions.map((skill) => (
                        <Badge
                          key={skill}
                          variant={
                            selectedSkills.includes(skill)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-4 py-2 text-sm hover:scale-105 transition-transform"
                          onClick={() =>
                            toggleSelection(
                              skill,
                              selectedSkills,
                              setSelectedSkills,
                              "secondarySkills",
                            )
                          }
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Experience Level *</Label>
                    <RadioGroup
                      value={experienceLevel}
                      onValueChange={(value) =>
                        setValue("experienceLevel", value, {
                          shouldValidate: true,
                        })
                      }
                      className="mt-3 space-y-3"
                    >
                      {[
                        "Beginner",
                        "Intermediate",
                        "Professional",
                        "Expert",
                      ].map((level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem value={level} id={`level-${level}`} />
                          <Label
                            htmlFor={`level-${level}`}
                            className="cursor-pointer font-normal"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.experienceLevel && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.experienceLevel.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Years of Experience *</Label>
                    <RadioGroup
                      value={yearsOfExperience}
                      onValueChange={(value) =>
                        setValue("yearsOfExperience", value, {
                          shouldValidate: true,
                        })
                      }
                      className="mt-3 space-y-3"
                    >
                      {[
                        "0–1 Years",
                        "1–3 Years",
                        "3–5 Years",
                        "5–10 Years",
                        "10+ Years",
                      ].map((years) => (
                        <div
                          key={years}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem value={years} id={`years-${years}`} />
                          <Label
                            htmlFor={`years-${years}`}
                            className="cursor-pointer font-normal"
                          >
                            {years}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.yearsOfExperience && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.yearsOfExperience.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>Industry Type *</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Select industries you work in
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((industry) => (
                        <Badge
                          key={industry}
                          variant={
                            selectedIndustries.includes(industry)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-4 py-2 text-sm hover:scale-105 transition-transform"
                          onClick={() =>
                            toggleSelection(
                              industry,
                              selectedIndustries,
                              setSelectedIndustries,
                              "industryTypes",
                            )
                          }
                        >
                          {industry}
                        </Badge>
                      ))}
                    </div>
                    {errors.industryTypes && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.industryTypes.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Languages Worked In *</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Select languages you work in
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge
                          key={language}
                          variant={
                            selectedLanguages.includes(language)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-4 py-2 text-sm hover:scale-105 transition-transform"
                          onClick={() =>
                            toggleSelection(
                              language,
                              selectedLanguages,
                              setSelectedLanguages,
                              "languages",
                            )
                          }
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                    {errors.languages && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.languages.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <Label>Portfolio Links (Optional)</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Add links to your social media profiles and portfolio
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor="instagram"
                          className="text-sm font-normal"
                        >
                          Instagram
                        </Label>
                        <Input
                          id="instagram"
                          {...register("portfolioLinks.instagram")}
                          placeholder="https://instagram.com/username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="youtube"
                          className="text-sm font-normal"
                        >
                          YouTube
                        </Label>
                        <Input
                          id="youtube"
                          {...register("portfolioLinks.youtube")}
                          placeholder="https://youtube.com/@username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vimeo" className="text-sm font-normal">
                          Vimeo
                        </Label>
                        <Input
                          id="vimeo"
                          {...register("portfolioLinks.vimeo")}
                          placeholder="https://vimeo.com/username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="website"
                          className="text-sm font-normal"
                        >
                          Website
                        </Label>
                        <Input
                          id="website"
                          {...register("portfolioLinks.website")}
                          placeholder="https://yourwebsite.com"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="showreelUrl">
                      Showreel or Work Sample Link (Optional)
                    </Label>
                    <Input
                      id="showreelUrl"
                      {...register("showreelUrl")}
                      placeholder="https://link-to-your-showreel.com"
                      className="mt-2"
                    />
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="currentCity">Current City *</Label>
                    <Input
                      id="currentCity"
                      {...register("currentCity")}
                      placeholder="Enter your current city"
                      className="mt-2"
                    />
                    {errors.currentCity && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.currentCity.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Willingness to Travel / Relocate *</Label>
                    <RadioGroup
                      value={travelWillingness}
                      onValueChange={(value) =>
                        setValue("travelWillingness", value, {
                          shouldValidate: true,
                        })
                      }
                      className="mt-3 space-y-3"
                    >
                      {["Yes", "No", "Project-based"].map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-3"
                        >
                          <RadioGroupItem
                            value={option}
                            id={`travel-${option}`}
                          />
                          <Label
                            htmlFor={`travel-${option}`}
                            className="cursor-pointer font-normal"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {errors.travelWillingness && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors.travelWillingness.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep === 6 ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Creating Account..."
                      : "Create Creator Account"}
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
