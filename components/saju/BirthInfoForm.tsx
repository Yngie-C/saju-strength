"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const IS_TOSS = process.env.NEXT_PUBLIC_BUILD_TARGET === 'toss';

const formStyles = IS_TOSS ? {
  label: 'text-t6 font-semibold text-tds-grey-700 mb-2',
  input: 'w-full px-4 py-3 rounded-[14px] border border-tds-grey-200 bg-tds-grey-50 text-tds-grey-900 text-st8 placeholder:text-tds-grey-500 focus:outline-none focus:border-tds-blue-500 focus:ring-1 focus:ring-tds-blue-500',
  select: 'w-full px-4 py-3 rounded-[14px] border border-tds-grey-200 bg-tds-grey-50 text-tds-grey-900 text-st8',
  helper: 'text-st11 text-tds-grey-500 mt-1',
  sectionTitle: 'text-t5 font-semibold text-tds-grey-900',
  divider: 'border-t border-tds-grey-200',
} : {
  label: 'text-sm font-medium text-white/70 mb-2',
  input: 'w-full px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50',
  select: 'w-full px-4 py-3 rounded-xl border border-white/15 bg-white/5 text-white',
  helper: 'text-xs text-white/40 mt-1',
  sectionTitle: 'text-lg font-semibold text-white',
  divider: 'border-t border-white/10',
} as const;

interface BirthInfoFormProps {
  onSubmit: (data: {
    year: number;
    month: number;
    day: number;
    hour: number | null;
    gender: "male" | "female";
    isLunar: boolean;
  }) => void;
  isLoading?: boolean;
}

const SIJU_OPTIONS = [
  { label: "모름", value: null },
  { label: "자시 (23–01시)", value: 0 },
  { label: "축시 (01–03시)", value: 2 },
  { label: "인시 (03–05시)", value: 4 },
  { label: "묘시 (05–07시)", value: 6 },
  { label: "진시 (07–09시)", value: 8 },
  { label: "사시 (09–11시)", value: 10 },
  { label: "오시 (11–13시)", value: 12 },
  { label: "미시 (13–15시)", value: 14 },
  { label: "신시 (15–17시)", value: 16 },
  { label: "유시 (17–19시)", value: 18 },
  { label: "술시 (19–21시)", value: 20 },
  { label: "해시 (21–23시)", value: 22 },
];

export function BirthInfoForm({ onSubmit, isLoading = false }: BirthInfoFormProps) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState<number | null | "">("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isLunar, setIsLunar] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!year || y < 1900 || y > 2050) errs.year = "1900~2050 사이 연도를 입력하세요.";
    if (!month || m < 1 || m > 12) errs.month = "1~12월을 입력하세요.";
    if (!day || d < 1 || d > 31) errs.day = "1~31일을 입력하세요.";
    if (hour === "") errs.hour = "시진을 선택하세요.";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      year: Number(year),
      month: Number(month),
      day: Number(day),
      hour: hour === null ? null : (hour as number),
      gender,
      isLunar,
    });
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* 양력 / 음력 토글 */}
      <motion.div variants={itemVariants} className="flex gap-2">
        <button
          type="button"
          onClick={() => setIsLunar(false)}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
            !isLunar
              ? "bg-primary text-white"
              : IS_TOSS ? "bg-tds-grey-100 text-tds-grey-500 hover:bg-tds-grey-200" : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
        >
          양력
        </button>
        <button
          type="button"
          onClick={() => setIsLunar(true)}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
            isLunar
              ? "bg-primary text-white"
              : IS_TOSS ? "bg-tds-grey-100 text-tds-grey-500 hover:bg-tds-grey-200" : "bg-white/5 text-white/50 hover:bg-white/10"
          )}
        >
          음력
        </button>
      </motion.div>

      {/* 년 / 월 / 일 */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className={formStyles.label}>년</label>
          <Input
            type="number"
            placeholder="1990"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={1900}
            max={2050}
            className={IS_TOSS ? formStyles.input : "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"}
          />
          {errors.year && <p className={formStyles.helper}>{errors.year}</p>}
        </div>
        <div className="space-y-1">
          <label className={formStyles.label}>월</label>
          <Input
            type="number"
            placeholder="1"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min={1}
            max={12}
            className={IS_TOSS ? formStyles.input : "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"}
          />
          {errors.month && <p className={formStyles.helper}>{errors.month}</p>}
        </div>
        <div className="space-y-1">
          <label className={formStyles.label}>일</label>
          <Input
            type="number"
            placeholder="1"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min={1}
            max={31}
            className={IS_TOSS ? formStyles.input : "bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-primary"}
          />
          {errors.day && <p className={formStyles.helper}>{errors.day}</p>}
        </div>
      </motion.div>

      {/* 시진 선택 */}
      <motion.div variants={itemVariants} className="space-y-1">
        <label className={formStyles.label}>시진 (태어난 시간)</label>
        <select
          value={hour === "" ? "" : hour === null ? "null" : String(hour)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") setHour("");
            else if (v === "null") setHour(null);
            else setHour(Number(v));
          }}
          className={IS_TOSS ? formStyles.select : "w-full h-10 rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-primary"}
        >
          <option value="" disabled className={IS_TOSS ? "bg-white" : "bg-gray-900"}>
            시진을 선택하세요
          </option>
          {SIJU_OPTIONS.map((opt) => (
            <option
              key={opt.label}
              value={opt.value === null ? "null" : String(opt.value)}
              className={IS_TOSS ? "bg-white" : "bg-gray-900"}
            >
              {opt.label}
            </option>
          ))}
        </select>
        {errors.hour && <p className={formStyles.helper}>{errors.hour}</p>}
      </motion.div>

      {/* 성별 */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className={formStyles.label}>성별</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors",
              gender === "male"
                ? "bg-blue-600 text-white"
                : IS_TOSS ? "bg-tds-grey-100 text-tds-grey-500 hover:bg-tds-grey-200" : "bg-white/5 text-white/50 hover:bg-white/10"
            )}
          >
            남성
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors",
              gender === "female"
                ? "bg-pink-600 text-white"
                : IS_TOSS ? "bg-tds-grey-100 text-tds-grey-500 hover:bg-tds-grey-200" : "bg-white/5 text-white/50 hover:bg-white/10"
            )}
          >
            여성
          </button>
        </div>
      </motion.div>

      {/* 제출 버튼 */}
      <motion.div variants={itemVariants}>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-white"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              분석 중...
            </span>
          ) : (
            "분석 시작"
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
}
