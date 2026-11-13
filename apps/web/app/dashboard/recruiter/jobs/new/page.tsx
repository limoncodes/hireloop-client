"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Building2,
    ChevronRight,
    Globe,
    MapPin,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select";
import { createJobs } from "@/lib/action/jobs";

// ---- Form data (one simple object) ----

export type JobForm = {
    title: string;
    company: string;
    category: string;
    jobType: string;
    remote: boolean;
    location: string;
    deadline: string;
    minSalary: string;
    maxSalary: string;
    frequency: string;
    responsibilities: string;
    requirements: string;
};

const initialJob: JobForm = {
    title: "",
    company: "",
    category: "Engineering & Tech",
    jobType: "Full-time",
    remote: true,
    location: "",
    deadline: "",
    minSalary: "",
    maxSalary: "",
    frequency: "per hour",
    responsibilities: "",
    requirements: "",
};

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

const categories = [
    "Engineering & Tech",
    "Design & Creative",
    "Marketing & Sales",
    "Finance & Accounting",
    "Customer Support",
    "Human Resources",
];

const frequencies = [
    "per hour",
    "per day",
    "per week",
    "per month",
    "per year",
];

// Shared dark input styling (matches the sign-up form)
const inputClass =
    "h-12 rounded-xl border-white/10 bg-[#1A1A1F] text-sm text-white placeholder:text-gray-500 focus-visible:border-purple-500/60 focus-visible:ring-2 focus-visible:ring-purple-500/20";

export default function NewJobPage() {
    const [form, setForm] = useState<JobForm>(initialJob);

    // One tiny setter used by every field
    const set = <K extends keyof JobForm>(key: K, value: JobForm[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: send to API — for now just show the collected data
        const result = await createJobs(form)
        console.log(result)
        // console.log("Publish Job:", form);
    };

    return (
        <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
            <form onSubmit={handlePublish} className="space-y-5">
                {/* Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        {/* Breadcrumb */}
                        <nav className="mb-3 flex items-center gap-1.5 text-sm text-gray-500">
                            <Link
                                href="/dashboard/recruiter/jobs"
                                className="transition-colors hover:text-white"
                            >
                                Manage Jobs
                            </Link>
                            <ChevronRight className="size-3.5 text-gray-600" />
                            <span className="text-gray-300">Create New Listing</span>
                        </nav>

                        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Post a New Job
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Fill in the position specifications to attract qualified talent
                            across our network.
                        </p>
                    </div>


                </div>

                {/* Section 1 — Basic Information */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5 sm:p-6">
                    <h2 className="mb-5 text-base font-semibold text-white">
                        1. Basic Information
                    </h2>

                    <div className="space-y-5">
                        {/* Job Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm text-gray-300">
                                Job Title <span className="text-purple-400">*</span>
                            </Label>
                            <Input
                                id="title"
                                value={form.title}
                                onChange={(e) => set("title", e.target.value)}
                                placeholder="Frontend Developer"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Company Name */}
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-sm text-gray-300">
                                    Company Name <span className="text-purple-400">*</span>
                                </Label>
                                <div className="group relative">
                                    <Building2 className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />
                                    <Input
                                        id="company"
                                        value={form.company}
                                        onChange={(e) => set("company", e.target.value)}
                                        placeholder="HirePulse Network"
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>

                            {/* Job Category */}
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-300">
                                    Job Category <span className="text-purple-400">*</span>
                                </Label>
                                <Select
                                    value={form.category}
                                    onValueChange={(value) => set("category", value as string)}
                                >
                                    <SelectTrigger
                                        className={`w-full justify-between px-3.5 ${inputClass}`}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#1A1A1F] text-white">
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Job Type */}
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-300">
                                Job Type <span className="text-purple-400">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {jobTypes.map((type) => {
                                    const selected = form.jobType === type;

                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => set("jobType", type)}
                                            className={`h-11 rounded-xl border text-sm font-semibold transition-all ${selected
                                                    ? "border-purple-500/60 bg-purple-500/[0.08] text-white"
                                                    : "border-white/10 bg-[#1A1A1F] text-gray-400 hover:border-white/20 hover:text-white"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2 — Location, Compensation & Timeline */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5 sm:p-6">
                    <h2 className="mb-5 text-base font-semibold text-white">
                        2. Location, Compensation &amp; Timeline
                    </h2>

                    <div className="space-y-5">
                        {/* Remote Work Allowed */}
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-[#1A1A1F] p-4">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                                    <Globe className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">
                                        Remote Work Allowed
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Enable worldwide or distributed candidate applications
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={form.remote}
                                onCheckedChange={(checked) => set("remote", checked)}
                                className="shrink-0"
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            {/* Job Location */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-x-3">
                                    <Label htmlFor="location" className="text-sm text-gray-300">
                                        Job Location (location)
                                    </Label>
                                    <span className="text-xs text-gray-500">Required</span>
                                </div>
                                <div className="group relative">
                                    <MapPin className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-purple-400" />
                                    <Input
                                        id="location"
                                        value={form.location}
                                        onChange={(e) => set("location", e.target.value)}
                                        placeholder="New York, USA"
                                        required
                                        className={`${inputClass} pl-11`}
                                    />
                                </div>
                            </div>

                            {/* Application Deadline */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="deadline"
                                    className="text-sm text-gray-300"
                                >
                                    Application Deadline (deadline)
                                </Label>
                                <Input
                                    id="deadline"
                                    type="date"
                                    value={form.deadline}
                                    onChange={(e) => set("deadline", e.target.value)}
                                    className={`${inputClass} [color-scheme:dark]`}
                                />
                            </div>
                        </div>

                        {/* Salary */}
                        <div className="grid gap-5 sm:grid-cols-3">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="minSalary"
                                    className="text-sm text-gray-300"
                                >
                                    Min Salary / Rate
                                </Label>
                                <Input
                                    id="minSalary"
                                    value={form.minSalary}
                                    onChange={(e) => set("minSalary", e.target.value)}
                                    placeholder="€ 25"
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="maxSalary"
                                    className="text-sm text-gray-300"
                                >
                                    Max Salary / Rate
                                </Label>
                                <Input
                                    id="maxSalary"
                                    value={form.maxSalary}
                                    onChange={(e) => set("maxSalary", e.target.value)}
                                    placeholder="€ 40"
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm text-gray-300">Frequency</Label>
                                <Select
                                    value={form.frequency}
                                    onValueChange={(value) => set("frequency", value as string)}
                                >
                                    <SelectTrigger
                                        className={`w-full justify-between px-3.5 ${inputClass}`}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="border-white/10 bg-[#1A1A1F] text-white">
                                        {frequencies.map((frequency) => (
                                            <SelectItem key={frequency} value={frequency}>
                                                {frequency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3 — Responsibilities & Requirements */}
                <section className="rounded-2xl border border-white/[0.07] bg-[#111114] p-5 sm:p-6">
                    <h2 className="mb-5 text-base font-semibold text-white">
                        3. Responsibilities &amp; Requirements
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="responsibilities"
                                className="text-sm text-gray-300"
                            >
                                Key Responsibilities{" "}
                                <span className="text-purple-400">*</span>
                            </Label>
                            <Textarea
                                id="responsibilities"
                                value={form.responsibilities}
                                onChange={(e) => set("responsibilities", e.target.value)}
                                placeholder={"- Build and maintain user interfaces\n- Collaborate with designers and backend engineers"}
                                required
                                rows={5}
                                className="rounded-xl border-white/10 bg-[#1A1A1F] text-sm text-white placeholder:text-gray-500 focus-visible:border-purple-500/60 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="requirements"
                                className="text-sm text-gray-300"
                            >
                                Qualifications &amp; Requirements{" "}
                                <span className="text-purple-400">*</span>
                            </Label>
                            <Textarea
                                id="requirements"
                                value={form.requirements}
                                onChange={(e) => set("requirements", e.target.value)}
                                placeholder={"- 3+ years of experience with React\n- Strong knowledge of TypeScript"}
                                required
                                rows={5}
                                className="rounded-xl border-white/10 bg-[#1A1A1F] text-sm text-white placeholder:text-gray-500 focus-visible:border-purple-500/60 focus-visible:ring-2 focus-visible:ring-purple-500/20"
                            />
                        </div>
                    </div>
                </section>
                <section>
                    <Button
                        type="submit"
                        className="h-11 w-full gap-2 rounded-xl bg-[#5C53FE] text-sm font-bold text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] transition-colors hover:bg-[#6D65FF] sm:w-auto"
                    >
                        Publish Job
                        <ArrowRight className="size-4" />
                    </Button>
                </section>
            </form>
        </div>
    );
}
