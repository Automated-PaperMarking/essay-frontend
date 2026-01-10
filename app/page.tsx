"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Lightning Fast Grading",
      description:
        "Automated essay evaluation in seconds, not hours. Save valuable time while maintaining accuracy.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Consistent Evaluation",
      description:
        "Apply uniform grading criteria across all submissions. Eliminate bias and ensure fairness.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "Detailed Analytics",
      description:
        "Track performance metrics and identify patterns. Make data-driven decisions to improve outcomes.",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      title: "Customizable Rubrics",
      description:
        "Define your own marking criteria and weightages. Adapt to any assessment framework with ease.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Essays Graded" },
    { value: "95%", label: "Accuracy Rate" },
    { value: "85%", label: "Time Saved" },
    { value: "500+", label: "Active Users" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-circle_at_top_right,_var(--tw-gradient-stops)] from-accent/5 via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative">
          <div
            className={`text-center space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-accent">
                AI-Powered Essay Evaluation
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Transform Essay Grading
                <br />
                <span className="text-accent">Into Minutes</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Leverage advanced automation to grade essays with precision and
                speed. Focus on teaching while we handle the evaluation.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => router.push("/projects")}
                className="group relative px-8 py-4 bg-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:-translate-y-1"
              >
                <span>Start Grading Now</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                onClick={() => router.push("/projects")}
                className="px-8 py-4 bg-white text-foreground font-semibold rounded-xl border-2 border-border hover:border-accent transition-all duration-300 hover:shadow-md"
              >
                View Papers
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center space-y-2 p-4 bg-white border border-border rounded-xl hover:border-accent transition-colors"
                >
                  <div className="text-3xl md:text-4xl font-bold text-accent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-sidebar-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for educators who value both efficiency and quality in
              assessment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl border border-border hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Simple 3-Step Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From upload to results in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Upload Essays",
                description:
                  "Drag and drop student submissions or upload in bulk. Support for multiple formats including PDF and DOCX.",
              },
              {
                step: "02",
                title: "Configure Rubric",
                description:
                  "Set your grading criteria, question weightages, and evaluation parameters. Customize to match your standards.",
              },
              {
                step: "03",
                title: "Review Results",
                description:
                  "Get instant grades with detailed feedback. Review, adjust, and export results in your preferred format.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="space-y-4">
                  <div className="text-7xl font-bold text-accent/10">
                    {item.step}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 -right-6 w-12 h-0.5 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-sidebar-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white border-2 border-accent/20 rounded-3xl p-12 space-y-8">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Ready to Transform Your Grading?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join hundreds of educators who have already streamlined their
                assessment workflow
              </p>
            </div>
            <button
              onClick={() => router.push("/projects")}
              className="group px-10 py-5 bg-accent text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto hover:-translate-y-1"
            >
              <span>Get Started Free</span>
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl text-foreground">
                Essay Grading
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Essay Grading Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
