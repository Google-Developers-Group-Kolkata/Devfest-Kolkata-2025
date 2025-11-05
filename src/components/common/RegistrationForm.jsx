import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/schemas/registrationSchema";
import axios from "axios";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/common/DatePicker";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegistrationForm({ user }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: user?.displayName || "",
            dob: "",
            phoneNo: "",
            gender: "OTHER",
            tshirtSize: "M",
            isVeg: true,
            institution: "",
            githubProfile: "",
            linkedinProfile: "",
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setSubmitError("");

        try {
            const token = await user.getIdToken();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200) {
                setSubmitError(
                    response.data.message ||
                        "An error occurred during registration"
                );
                return;
            }

            toast.success("Registration successful!");
            router.push("/ticket");
        } catch (error) {
            setSubmitError(
                error.message || "An error occurred during registration"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-dark text-white rounded-lg shadow border-2 border-[#FFF3D2] p-8">
            <h2 className="text-2xl font-bold foreground-dark mb-6 albert_sans">
                Complete Your Registration
            </h2>
            <p className="foreground-dark mb-8">
                Please fill out the form below to complete your DevFest
                registration.
            </p>

            {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{submitError}</p>
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-dark text-white placeholder:text-gray-400 autofill:bg-dark autofill:text-white [&:-webkit-autofill]:bg-dark [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1a1a1a_inset]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date of Birth Field */}
                    <FormField
                        control={form.control}
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth *</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        className="bg-dark text-white"
                                        buttonClassName="bg-dark text-white hover:text-[#FFF3D2]"
                                        popoverClassName="shadow-xl bg-dark text-white"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Gender Field */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full px-3 py-2 border rounded-md shadow-sm bg-dark text-white border-gray-300 hover:text-[#FFF3D2]"
                                            iconClassName="text-white opacity-100 hover:text-[#FFF3D2]"
                                        >
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-dark text-white border-gray-300">
                                        <SelectItem value="MALE">
                                            Male
                                        </SelectItem>
                                        <SelectItem value="FEMALE">
                                            Female
                                        </SelectItem>
                                        <SelectItem value="OTHER">
                                            Other
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Number Field */}
                    <FormField
                        control={form.control}
                        name="phoneNo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-dark text-white placeholder:text-gray-400 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1a1a1a_inset]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* T-shirt Size Field */}
                    <FormField
                        control={form.control}
                        name="tshirtSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>T-shirt Size *</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full px-3 py-2 border rounded-md shadow-sm bg-dark text-white border-gray-300 hover:text-[#FFF3D2]"
                                            iconClassName="text-white opacity-100 hover:text-[#FFF3D2]"
                                        >
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-dark text-white border-gray-300">
                                        <SelectItem value="XS">XS</SelectItem>
                                        <SelectItem value="S">S</SelectItem>
                                        <SelectItem value="M">M</SelectItem>
                                        <SelectItem value="L">L</SelectItem>
                                        <SelectItem value="XL">XL</SelectItem>
                                        <SelectItem value="XXL">XXL</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Dietary Preference */}
                    <FormField
                        control={form.control}
                        name="isVeg"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dietary Preference *</FormLabel>
                                <Select
                                    onValueChange={(value) =>
                                        field.onChange(value === "true")
                                    }
                                    defaultValue={
                                        field.value ? "true" : "false"
                                    }
                                >
                                    <FormControl>
                                        <SelectTrigger
                                            className="w-full px-3 py-2 border rounded-md shadow-sm bg-dark text-white border-gray-300 hover:text-[#FFF3D2]"
                                            iconClassName="text-white opacity-100 hover:text-[#FFF3D2]"
                                        >
                                            <SelectValue placeholder="Select preference" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-dark text-white border-gray-300">
                                        <SelectItem value="true">
                                            Vegetarian
                                        </SelectItem>
                                        <SelectItem value="false">
                                            Non-Vegetarian
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Institution Field */}
                    <FormField
                        control={form.control}
                        name="institution"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institution/Company</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Your school, college, or company"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-dark text-white placeholder:text-gray-400 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1a1a1a_inset]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* GitHub Profile Field */}
                    <FormField
                        control={form.control}
                        name="githubProfile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GitHub Profile URL</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://github.com/yourusername"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-dark text-white placeholder:text-gray-400 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1a1a1a_inset]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* LinkedIn Profile Field */}
                    <FormField
                        control={form.control}
                        name="linkedinProfile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>LinkedIn Profile URL</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="url"
                                        placeholder="https://linkedin.com/in/yourusername"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-dark text-white placeholder:text-gray-400 [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#1a1a1a_inset]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 foreground-dark font-medium py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FFF3D2] mr-2"></div>
                                    Registering...
                                </div>
                            ) : (
                                "Complete Registration"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>

            <div className="mt-6 text-xs text-gray-500 text-center">
                Fields marked with * are required
            </div>
        </div>
    );
}
