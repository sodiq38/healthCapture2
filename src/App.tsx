import React, { useState, type JSX } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FaUser,
  FaHeartbeat,
  FaHistory,
  FaUsers,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import "./App.css";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Check,
  HeartPulse,
  Pencil,
  Pill,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Calendar } from "./components/ui/calendar";

// Type Definitions
type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
type Genotype = "AA" | "AS" | "AC" | "SS" | "SC";
type Sex = "Male" | "Female" | "Other" | "Prefer not to say";
type HeightUnit = "cm" | "ft";

type OrganDonorStatus = "Yes" | "No" | "Undecided";
type Relationship = "Spouse" | "Parent" | "Sibling" | "Friend" | "Other";

interface FormData {
  lagId: string;
  fullName: string;
  email: string;
  bloodGroup: BloodGroup | "";
  genotype: Genotype | "";
  sex: Sex | "";
  height: string;
  heightUnit: HeightUnit;
  disabilities: string;
  conditions: string[];
  currentConditionInput?: string;
  editingConditionIndex?: number | null;
  editingConditionValue?: string;
  allergies: string[];
  familyIssues: string[];
  currentFamilyIssueInput?: string;
  editingFamilyIssueIndex?: number | null;
  editingFamilyIssueValue?: string;
  currentAllergyInput?: string;
  editingAllergyIndex?: number | null;
  editingAllergyValue?: string;
  medications: string[];
  currentMedicationInput?: string;
  editingMedicationIndex?: number | null;
  editingMedicationValue?: string;
  surgeries: string;
  organDonor: OrganDonorStatus | "";
  hmoProvider: string;
  emergencyName: string;
  emergencyRelationship: Relationship | "";
  emergencyPhone: string;
}
interface Section {
  id: string;
  title: string;
  icon: React.ComponentType;
}

interface ValidationErrors {
  emergencyName?: string;
  emergencyRelationship?: string;
  emergencyPhone?: string;
}

interface SectionProps {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(
    field: K,
    value: FormData[ K ],
  ) => void;
  onNext?: () => void;
  onBack?: () => void;
}

interface MedicalProfileProps extends SectionProps {
  toggleMultiSelect: <
    K extends keyof Pick<FormData, "conditions" | "allergies" | "familyIssues">,
  >(
    field: K,
    value: FormData[ K ][ number ],
  ) => void;
}

interface EmergencyInfoProps extends SectionProps {
  setShowSuccess: (show: boolean) => void;
}

// Constants
const SECTIONS: Section[] = [
  { id: "basic", title: "Basic Information", icon: FaUser },
  { id: "medical", title: "Medical Profile", icon: FaHeartbeat },
  { id: "history", title: "Medical History", icon: FaHistory },
  { id: "family", title: "Family Health", icon: FaUsers },
  {
    id: "emergency",
    title: "Emergency & Insurance",
    icon: FaExclamationTriangle,
  },
];

const HMO_PROVIDERS: readonly string[] = [
  "Hygeia HMO",
  "Reliance HMO",
  "Avon HMO",
  "AXA Mansard",
  "MetroHealth HMO",
  "Total Health Trust",
  "Healthcare International",
  "Clearline HMO",
  "Other",
] as const;

const BLOOD_GROUPS: readonly BloodGroup[] = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
const GENOTYPES: readonly Genotype[] = [ "AA", "AS", "AC", "SS", "SC" ] as const;
const SEXES: readonly Sex[] = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
] as const;

const ORGAN_DONOR_STATUSES: readonly OrganDonorStatus[] = [
  "Yes",
  "No",
  "Undecided",
] as const;
const RELATIONSHIPS: readonly Relationship[] = [
  "Spouse",
  "Parent",
  "Sibling",
  "Friend",
  "Other",
] as const;

function App() {
  const [ currentSection, setCurrentSection ] = useState<number>(0);
  const [ showForms, setShowForms ] = useState<boolean>(false);
  const [ formData, setFormData ] = useState<FormData>({
    lagId: "LAG-2024-00789",
    fullName: "Adebayo Olamide",
    email: "adebayo.olamide@email.com",
    bloodGroup: "",
    genotype: "",
    sex: "",
    height: "",
    heightUnit: "cm",
    disabilities: "",
    conditions: [],
    allergies: [],
    medications: [],
    currentMedicationInput: "",
    editingMedicationIndex: null,
    editingMedicationValue: "",
    surgeries: "",
    familyIssues: [],
    organDonor: "",
    hmoProvider: "",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
  });

  const [ showSuccess, setShowSuccess ] = useState<boolean>(false);

  const updateFormData = <K extends keyof FormData>(
    field: K,
    value: FormData[ K ],
  ): void => {
    setFormData((prev) => ({ ...prev, [ field ]: value }));
  };

  const toggleMultiSelect = <
    K extends keyof Pick<FormData, "conditions" | "allergies" | "familyIssues">,
  >(
    field: K,
    value: FormData[ K ][ number ],
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [ field ]: prev[ field ].includes(value)
        ? prev[ field ].filter((item) => item !== value)
        : [ ...prev[ field ], value ],
    }));
  };

  const nextSection = (): void => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = (): void => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderSection = (): JSX.Element | null => {
    switch (currentSection) {
      case 0:
        return (
          <BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextSection}
          />
        );
      case 1:
        return (
          <MedicalProfile
            formData={formData}
            updateFormData={updateFormData}
            toggleMultiSelect={toggleMultiSelect}
            onNext={nextSection}
            onBack={prevSection}
          />
        );
      case 2:
        return (
          <MedicalHistory
            formData={formData}
            updateFormData={updateFormData}
            onNext={nextSection}
            onBack={prevSection}
          />
        );
      case 3:
        return (
          <FamilyHealth
            formData={formData}
            updateFormData={updateFormData}
            toggleMultiSelect={toggleMultiSelect}
            onNext={nextSection}
            onBack={prevSection}
          />
        );
      case 4:
        return (
          <EmergencyInfo
            formData={formData}
            updateFormData={updateFormData}
            onBack={prevSection}
            setShowSuccess={setShowSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen grid place-items-center w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full max-w-4xl">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
            Medical Information Form
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Complete your health profile for better care
          </p>
        </header>

        {showForms ? (
          <>
            <ProgressBar
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
            />

            <div className="transition-all duration-300">{renderSection()}</div>
          </>
        ) : (
          <div className="text-center space-y-4 max-w-[20rem] mx-auto px-4">
            <h1 className="font-semibold text-xl sm:text-2xl">Enter your LAG ID</h1>
            <Input placeholder="LAGXXXXXXX" className="text-base" />
            <Button
              className="w-full text-base sm:text-lg"
              onClick={() => {
                setShowForms(true);
              }}
            >
              Next
            </Button>
          </div>
        )}

        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </div>
    </div>
  );
}

function ProgressBar({
  currentSection,
  setCurrentSection,
}: {
  currentSection: number;
  setCurrentSection: (a: number) => void;
}) {
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex justify-between mb-3 sm:mb-4 gap-1 sm:gap-2">
        {SECTIONS.map((section, index) => {
          const IconComponent = section.icon as React.FC;
          return (
            <div
              onClick={() => setCurrentSection(index)}
              key={section.id}
              className="flex flex-col items-center flex-1 cursor-pointer"
            >
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mb-1 transition-all duration-300 text-sm sm:text-base md:text-lg ${index <= currentSection
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-gray-200 text-gray-500"
                  }`}
              >
                <IconComponent />
              </div>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg text-center hidden md:block text-gray-600">
                {section.title}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
        <div
          className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function BasicInfo({ formData, updateFormData, onNext }: SectionProps) {
  return (
    <div className="border rounded-md border-gray-300 p-0">
      <div className="bg-blue-700 text-white rounded-t-md p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaUser className="text-xl sm:text-2xl md:text-3xl" />
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">Basic Information</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100">
              Let's start with the essentials
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lagId" className="text-base sm:text-lg md:text-xl">
              LAG ID <span className="text-red-400">*</span>
            </Label>
            <Input
              id="lagId"
              value={formData.lagId}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base sm:text-lg md:text-xl">
              Full Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-base sm:text-lg md:text-xl">
            Email Address <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-gray-50"
          />
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bloodGroup" className="text-xl">
              Blood Group <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.bloodGroup}
              onValueChange={(v: BloodGroup) => updateFormData("bloodGroup", v)}
            >
              <SelectTrigger id="bloodGroup">
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genotype" className="text-xl">
              Genotype <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.genotype}
              onValueChange={(v: Genotype) => updateFormData("genotype", v)}
            >
              <SelectTrigger id="genotype">
                <SelectValue placeholder="Select genotype" />
              </SelectTrigger>
              <SelectContent>
                {GENOTYPES.map((gt) => (
                  <SelectItem key={gt} value={gt}>
                    {gt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-xl">
              Sex <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.sex}
              onValueChange={(v: Sex) => updateFormData("sex", v)}
            >
              <SelectTrigger id="sex">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                {SEXES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height" className="text-xl">
              Height (cm) <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="height"
                type="number"
                placeholder="Enter height"
                value={formData.height}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateFormData("height", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="disabilities" className="text-xl">
            Disabilities (if any)
          </Label>
          <textarea
            id="disabilities"
            className="w-full px-3 py-2 border rounded-md min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe any disabilities or mobility issues..."
            value={formData.disabilities}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              updateFormData("disabilities", e.target.value)
            }
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg md:text-xl w-full sm:w-auto">
            Next <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MedicalProfile({
  formData,
  updateFormData,
  onNext,
  onBack,
}: MedicalProfileProps) {
  const addCondition = () => {
    if (formData.currentConditionInput?.trim()) {
      const newConditions = [
        ...(formData.conditions || []),
        formData.currentConditionInput.trim(),
      ];
      updateFormData("conditions", newConditions);
      updateFormData("currentConditionInput", "");
    }
  };

  const startEditingCondition = (index: number, condition: string) => {
    updateFormData("editingConditionIndex", index);
    updateFormData("editingConditionValue", condition);
  };

  const saveEditCondition = (index: number) => {
    if (formData.editingConditionValue?.trim()) {
      const newConditions = [ ...formData.conditions ];
      newConditions[ index ] = formData.editingConditionValue.trim();
      updateFormData("conditions", newConditions);
      updateFormData("editingConditionIndex", null);
      updateFormData("editingConditionValue", "");
    }
  };

  const cancelEditCondition = () => {
    updateFormData("editingConditionIndex", null);
    updateFormData("editingConditionValue", "");
  };

  const removeCondition = (index: number) => {
    const newConditions = formData.conditions.filter(
      (_: string, i: number) => i !== index,
    );
    updateFormData("conditions", newConditions);
  };

  const addAllergy = () => {
    if (formData.currentAllergyInput?.trim()) {
      const newAllergies = [
        ...(formData.allergies || []),
        formData.currentAllergyInput.trim(),
      ];
      updateFormData("allergies", newAllergies);
      updateFormData("currentAllergyInput", "");
    }
  };

  const startEditingAllergy = (index: number, allergy: string) => {
    updateFormData("editingAllergyIndex", index);
    updateFormData("editingAllergyValue", allergy);
  };

  const saveEditAllergy = (index: number) => {
    if (formData.editingAllergyValue?.trim()) {
      const newAllergies = [ ...formData.allergies ];
      newAllergies[ index ] = formData.editingAllergyValue.trim();
      updateFormData("allergies", newAllergies);
      updateFormData("editingAllergyIndex", null);
      updateFormData("editingAllergyValue", "");
    }
  };

  const cancelEditAllergy = () => {
    updateFormData("editingAllergyIndex", null);
    updateFormData("editingAllergyValue", "");
  };

  const removeAllergy = (index: number) => {
    const newAllergies = formData.allergies.filter(
      (_: string, i: number) => i !== index,
    );
    updateFormData("allergies", newAllergies);
  };

  const addMedication = () => {
    if (formData.currentMedicationInput?.trim()) {
      const newMeds = [
        ...(formData.medications || []),
        formData.currentMedicationInput.trim(),
      ];
      updateFormData("medications", newMeds);
      updateFormData("currentMedicationInput", "");
    }
  };

  const startEditing = (index: number, medication: string) => {
    updateFormData("editingMedicationIndex", index);
    updateFormData("editingMedicationValue", medication);
  };

  const saveEdit = (index: number) => {
    if (formData.editingMedicationValue?.trim()) {
      const newMeds = [ ...formData.medications ];
      newMeds[ index ] = formData.editingMedicationValue.trim();
      updateFormData("medications", newMeds);
      updateFormData("editingMedicationIndex", null);
      updateFormData("editingMedicationValue", "");
    }
  };

  const cancelEdit = () => {
    updateFormData("editingMedicationIndex", null);
    updateFormData("editingMedicationValue", "");
  };

  const removeMedication = (index: number) => {
    const newMeds = formData.medications.filter(
      (_: string, i: number) => i !== index,
    );
    updateFormData("medications", newMeds);
  };

  return (
    <div className="border rounded-md border-gray-300 p-0">
      <div className="bg-blue-700 text-white rounded-t-md p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl">Medical Profile</h2>
            <p className="text-sm sm:text-base md:text-lg text-red-100">Your current health snapshot</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="conditions" className="text-base sm:text-lg md:text-xl font-semibold">
            Underlying Health Conditions
          </Label>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-3">
            Add any health conditions you have
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              className="p-5 text-lg"
              id="conditions"
              type="text"
              placeholder="e.g., Diabetes, Hypertension"
              value={formData.currentConditionInput || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("currentConditionInput", e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCondition();
                }
              }}
            />
            <Button
              type="button"
              onClick={addCondition}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {formData.conditions && formData.conditions.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {formData.conditions.map((condition: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border rounded-md bg-gray-50"
                >
                  {formData.editingConditionIndex === index ? (
                    <>
                      <Input
                        type="text"
                        className="flex-1"
                        value={formData.editingConditionValue || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateFormData(
                            "editingConditionValue",
                            e.target.value,
                          )
                        }
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEditCondition(index);
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveEditCondition(index)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEditCondition}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="flex-1">{condition}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditingCondition(index, condition)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCondition(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <Label htmlFor="allergies" className="text-xl font-semibold">
            Known Allergies
          </Label>
          <p className="text-lg text-gray-500 mb-3">
            Add any allergies you have
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              className="p-5 text-lg"
              id="allergies"
              type="text"
              placeholder="e.g., Penicillin, Peanuts"
              value={formData.currentAllergyInput || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("currentAllergyInput", e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAllergy();
                }
              }}
            />
            <Button
              type="button"
              onClick={addAllergy}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {formData.allergies && formData.allergies.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {formData.allergies.map((allergy: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border rounded-md bg-gray-50"
                >
                  {formData.editingAllergyIndex === index ? (
                    <>
                      <Input
                        type="text"
                        className="flex-1 text-lg p-5"
                        value={formData.editingAllergyValue || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateFormData("editingAllergyValue", e.target.value)
                        }
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEditAllergy(index);
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveEditAllergy(index)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEditAllergy}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span className="flex-1">{allergy}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditingAllergy(index, allergy)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAllergy(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <Label htmlFor="medications" className="text-xl font-semibold">
            Current Medications
          </Label>
          <p className="text-lg text-gray-500 mb-3">
            Add medications you're currently taking
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              className="p-5 text-lg"
              id="medications"
              type="text"
              placeholder="e.g., Lisinopril 10mg daily"
              value={formData.currentMedicationInput || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("currentMedicationInput", e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addMedication();
                }
              }}
            />
            <Button
              type="button"
              onClick={addMedication}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {formData.medications && formData.medications.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {formData.medications.map((med: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border rounded-md bg-gray-50"
                >
                  {formData.editingMedicationIndex === index ? (
                    <>
                      <Input
                        type="text"
                        className="flex-1"
                        value={formData.editingMedicationValue || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateFormData(
                            "editingMedicationValue",
                            e.target.value,
                          )
                        }
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEdit(index);
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveEdit(index)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Pill className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="flex-1">{med}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(index, med)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <Button variant="outline" className="text-base sm:text-lg md:text-xl w-full sm:w-auto" onClick={onBack}>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg md:text-xl w-full sm:w-auto">
            Next <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MedicalHistory({
  formData,
  updateFormData,
  onNext,
  onBack,
}: SectionProps): JSX.Element {
  const [ surgeryName, setSurgeryName ] = React.useState("");
  const [ surgeryDate, setSurgeryDate ] = React.useState("");
  const [ editIndex, setEditIndex ] = React.useState<number | null>(null);

  const surgeries = formData.surgeries ? JSON.parse(formData.surgeries) : [];

  const handleAdd = () => {
    if (!surgeryName.trim() || !surgeryDate) return;

    const newSurgery = { name: surgeryName, date: surgeryDate };
    let updatedSurgeries;

    if (editIndex !== null) {
      updatedSurgeries = [ ...surgeries ];
      updatedSurgeries[ editIndex ] = newSurgery;
      setEditIndex(null);
    } else {
      updatedSurgeries = [ ...surgeries, newSurgery ];
    }

    updateFormData("surgeries", JSON.stringify(updatedSurgeries));
    setSurgeryName("");
    setSurgeryDate("");
  };

  const handleEdit = (index: number) => {
    setSurgeryName(surgeries[ index ].name);
    setSurgeryDate(surgeries[ index ].date);
    setEditIndex(index);
  };

  const handleRemove = (index: number) => {
    const updatedSurgeries = surgeries.filter(
      (_: any, i: number) => i !== index,
    );
    updateFormData("surgeries", JSON.stringify(updatedSurgeries));
  };

  return (
    <div className="border rounded-md border-gray-300 p-0">
      <div className="bg-blue-700 text-white rounded-t-md p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaHistory className="text-xl sm:text-2xl md:text-3xl" />
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl">Medical History</h2>
            <p className="text-sm sm:text-base md:text-lg text-purple-100">
              Past conditions and treatments
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            This information helps healthcare providers understand your complete
            medical background and make informed decisions.
          </AlertDescription>
        </Alert>
        <div className="space-y-4 pb-12 sm:pb-16 md:pb-20">
          <Label className="text-base sm:text-lg md:text-xl">Previous Surgeries</Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <Input
                className="p-5 text-lg"
                placeholder="Surgery name (e.g., Appendectomy)"
                value={surgeryName}
                onChange={(e) => setSurgeryName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex-1 justify-start text-left font-normal ${!surgeryDate && "text-muted-foreground"
                      }`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {surgeryDate ? (
                      new Date(surgeryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    defaultMonth={new Date()}
                    mode="single"
                    className="p-5 text-lg"
                    selected={surgeryDate ? new Date(surgeryDate) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setSurgeryDate(date.toISOString().split("T")[ 0 ]);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Button
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editIndex !== null ? "Update" : "Add"}
              </Button>
            </div>
          </div>
          {surgeries.length > 0 && (
            <div className="space-y-2 mt-4">
              {surgeries.map((surgery: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                >
                  <div>
                    <p className="font-medium">{surgery.name}</p>
                    <p className="text-base text-gray-500">
                      {new Date(surgery.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleRemove(index)}
                      className="text-red-600 hover:text-red-700 "
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button variant="outline" className="text-base sm:text-lg md:text-xl w-full sm:w-auto" onClick={onBack}>
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg md:text-xl w-full sm:w-auto">
            Next <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function FamilyHealth({
  formData,
  updateFormData,
  onNext,
  onBack,
}: MedicalProfileProps) {
  const addFamilyIssue = () => {
    if (formData.currentFamilyIssueInput?.trim()) {
      const newIssues = [
        ...(formData.familyIssues || []),
        formData.currentFamilyIssueInput.trim(),
      ];
      updateFormData("familyIssues", newIssues);
      updateFormData("currentFamilyIssueInput", "");
    }
  };

  const startEditingFamilyIssue = (index: number, issue: string) => {
    updateFormData("editingFamilyIssueIndex", index);
    updateFormData("editingFamilyIssueValue", issue);
  };

  const saveEditFamilyIssue = (index: number) => {
    if (formData.editingFamilyIssueValue?.trim()) {
      const newIssues = [ ...formData.familyIssues ];
      newIssues[ index ] = formData.editingFamilyIssueValue.trim();
      updateFormData("familyIssues", newIssues);
      updateFormData("editingFamilyIssueIndex", null);
      updateFormData("editingFamilyIssueValue", "");
    }
  };

  const cancelEditFamilyIssue = () => {
    updateFormData("editingFamilyIssueIndex", null);
    updateFormData("editingFamilyIssueValue", "");
  };

  const removeFamilyIssue = (index: number) => {
    const newIssues = formData.familyIssues.filter(
      (_: string, i: number) => i !== index,
    );
    updateFormData("familyIssues", newIssues);
  };

  return (
    <div className="border rounded-md border-gray-300 p-0">
      <div className="bg-blue-700 text-white rounded-t-md p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaUsers className="text-xl sm:text-2xl md:text-3xl" />
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl">Family Health Background</h2>
            <p className="text-sm sm:text-base md:text-lg text-green-100">
              Understanding genetic factors
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription>
            Family health history can reveal patterns that may affect your
            health risks. This helps in preventive care planning.
          </AlertDescription>
        </Alert>
        <div>
          <Label htmlFor="familyIssues" className="text-base sm:text-lg md:text-xl font-semibold">
            Family Health Issues
          </Label>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mb-3">
            Add any conditions that run in your immediate family
          </p>
          <div className="flex gap-2 mb-4">
            <Input
              id="familyIssues"
              type="text"
              placeholder="e.g., Heart Disease, Diabetes"
              value={formData.currentFamilyIssueInput || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("currentFamilyIssueInput", e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFamilyIssue();
                }
              }}
            />
            <Button
              type="button"
              onClick={addFamilyIssue}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          {formData.familyIssues && formData.familyIssues.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {formData.familyIssues.map((issue: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 border rounded-md bg-gray-50"
                >
                  {formData.editingFamilyIssueIndex === index ? (
                    <>
                      <Input
                        type="text"
                        className="flex-1"
                        value={formData.editingFamilyIssueValue || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateFormData(
                            "editingFamilyIssueValue",
                            e.target.value,
                          )
                        }
                        onKeyPress={(
                          e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveEditFamilyIssue(index);
                          }
                        }}
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => saveEditFamilyIssue(index)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={cancelEditFamilyIssue}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="flex-1">{issue}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditingFamilyIssue(index, issue)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFamilyIssue(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <Separator />
        <div>
          <Label htmlFor="organDonor" className="text-xl font-semibold">
            Organ Donor Status
          </Label>
          <p className="text-lg text-gray-500 mb-2">
            Would you like to be an organ donor?
          </p>
          <Select
            value={formData.organDonor}
            onValueChange={(v: OrganDonorStatus) =>
              updateFormData("organDonor", v)
            }
          >
            <SelectTrigger id="organDonor">
              <SelectValue placeholder="Select your preference" />
            </SelectTrigger>
            <SelectContent>
              {ORGAN_DONOR_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <Button variant="outline" className="text-base sm:text-lg md:text-xl w-full sm:w-auto" onClick={onBack}>
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700 text-base sm:text-lg md:text-xl w-full sm:w-auto">
            Next <FaArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
function EmergencyInfo({
  formData,
  updateFormData,
  onBack,
  setShowSuccess,
}: EmergencyInfoProps): JSX.Element {
  const [ errors, setErrors ] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.emergencyName)
      newErrors.emergencyName = "Emergency contact name is required";
    if (!formData.emergencyRelationship)
      newErrors.emergencyRelationship = "Relationship is required";
    if (!formData.emergencyPhone)
      newErrors.emergencyPhone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      setShowSuccess(true);
    }
  };

  return (
    <div className="border rounded-md border-gray-300 p-0">
      <div className="bg-blue-700 text-white rounded-t-md p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <FaExclamationTriangle className="text-xl sm:text-2xl md:text-3xl" />
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl">Emergency & Insurance</h2>
            <p className="text-sm sm:text-base md:text-lg text-orange-100">
              Critical contact information
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Alert className="bg-orange-50 border-orange-200">
          <AlertDescription>
            This information is crucial in case of medical emergencies. Please
            ensure all details are accurate and up-to-date.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 lg:gap-16">
          <div className="space-y-2 flex-1">
            <Label htmlFor="hmoID" className="text-base sm:text-lg md:text-xl">
              HMO/Insurance Provider
            </Label>
            <Select
              value={formData.hmoProvider}
              onValueChange={(v: string) => updateFormData("hmoProvider", v)}
            >
              <SelectTrigger id="hmoProvider">
                <SelectValue placeholder="Select your HMO provider" />
              </SelectTrigger>
              <SelectContent>
                {HMO_PROVIDERS.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <Label htmlFor="emergencyName" className="text-base sm:text-lg">
              HMO ID<span className="text-red-400">*</span>
            </Label>
            <Input
              id="emergencyName"
              placeholder="e.g 89188129"
              value={formData.emergencyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("emergencyName", e.target.value)
              }
              className={errors.emergencyName ? "border-red-500" : ""}
            />
            {errors.emergencyName && (
              <p className="text-red-500 text-base mt-1">
                {errors.emergencyName}
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Emergency Contact</h3>

          <div className="space-y-2">
            <Label htmlFor="emergencyName" className="text-lg">
              Contact Name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="emergencyName"
              placeholder="Full name"
              value={formData.emergencyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("emergencyName", e.target.value)
              }
              className={errors.emergencyName ? "border-red-500" : ""}
            />
            {errors.emergencyName && (
              <p className="text-red-500 text-base mt-1">
                {errors.emergencyName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyRelationship" className="text-lg">
              Relationship <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.emergencyRelationship}
              onValueChange={(v: Relationship) =>
                updateFormData("emergencyRelationship", v)
              }
            >
              <SelectTrigger
                id="emergencyRelationship"
                className={errors.emergencyRelationship ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {RELATIONSHIPS.map((rel) => (
                  <SelectItem key={rel} value={rel}>
                    {rel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.emergencyRelationship && (
              <p className="text-red-500 text-base mt-1">
                {errors.emergencyRelationship}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyPhone" className="text-lg">
              Phone Number <span className="text-red-400">*</span>
            </Label>
            <Input
              id="emergencyPhone"
              type="tel"
              placeholder="+234 XXX XXX XXXX"
              value={formData.emergencyPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("emergencyPhone", e.target.value)
              }
              className={errors.emergencyPhone ? "border-red-500" : ""}
            />
            {errors.emergencyPhone && (
              <p className="text-red-500 text-base mt-1">
                {errors.emergencyPhone}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <Button variant="outline" className="text-base sm:text-lg md:text-xl w-full sm:w-auto" onClick={onBack}>
            <FaArrowLeft className="mr-2" /> Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-base sm:text-lg md:text-xl w-full sm:w-auto"
          >
            Submit Form <FaCheckCircle className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ onClose }: { onClose: () => void }): JSX.Element {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="max-w-md w-full animate-in zoom-in duration-300 bg-white rounded-lg p-6 sm:p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <FaCheckCircle className="text-green-600 text-2xl sm:text-3xl md:text-4xl" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">Form Submitted Successfully!</h2>
          <p className="text-base sm:text-lg text-gray-600">
            Your medical information has been securely saved
          </p>
        </div>
        <div className="text-center pb-4 sm:pb-6 mt-4">
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
            Thank you for completing your medical information form. Your
            healthcare provider now has access to your updated health profile.
          </p>
          <Button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-base sm:text-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;

/**
 * TODO: other should have custom text
 * TODO: use specific cancer types
 */
