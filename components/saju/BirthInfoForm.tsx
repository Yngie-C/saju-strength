"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { designTokens } from '@/lib/design-tokens';

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
  { label: "자시 (23:30–01:30)", value: 0 },
  { label: "축시 (01:30–03:30)", value: 2 },
  { label: "인시 (03:30–05:30)", value: 4 },
  { label: "묘시 (05:30–07:30)", value: 6 },
  { label: "진시 (07:30–09:30)", value: 8 },
  { label: "사시 (09:30–11:30)", value: 10 },
  { label: "오시 (11:30–13:30)", value: 12 },
  { label: "미시 (13:30–15:30)", value: 14 },
  { label: "신시 (15:30–17:30)", value: 16 },
  { label: "유시 (17:30–19:30)", value: 18 },
  { label: "술시 (19:30–21:30)", value: 20 },
  { label: "해시 (21:30–23:30)", value: 22 },
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
              : designTokens.toggleInactive
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
              : designTokens.toggleInactive
          )}
        >
          음력
        </button>
      </motion.div>

      {/* 년 / 월 / 일 */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className={designTokens.formLabel}>년</label>
          <Input
            type="number"
            placeholder="1990"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min={1900}
            max={2050}
            className={designTokens.inputToss}
          />
          {errors.year && <p className={designTokens.formHelper}>{errors.year}</p>}
        </div>
        <div className="space-y-1">
          <label className={designTokens.formLabel}>월</label>
          <Input
            type="number"
            placeholder="1"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min={1}
            max={12}
            className={designTokens.inputToss}
          />
          {errors.month && <p className={designTokens.formHelper}>{errors.month}</p>}
        </div>
        <div className="space-y-1">
          <label className={designTokens.formLabel}>일</label>
          <Input
            type="number"
            placeholder="1"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            min={1}
            max={31}
            className={designTokens.inputToss}
          />
          {errors.day && <p className={designTokens.formHelper}>{errors.day}</p>}
        </div>
      </motion.div>

      {/* 시진 선택 */}
      <motion.div variants={itemVariants} className="space-y-1">
        <label className={designTokens.formLabel}>시진 (태어난 시간)</label>
        <select
          value={hour === "" ? "" : hour === null ? "null" : String(hour)}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") setHour("");
            else if (v === "null") setHour(null);
            else setHour(Number(v));
          }}
          className={designTokens.selectToss}
        >
          <option value="" disabled className={designTokens.optionBg}>
            시진을 선택하세요
          </option>
          {SIJU_OPTIONS.map((opt) => (
            <option
              key={opt.label}
              value={opt.value === null ? "null" : String(opt.value)}
              className={designTokens.optionBg}
            >
              {opt.label}
            </option>
          ))}
        </select>
        {errors.hour && <p className={designTokens.formHelper}>{errors.hour}</p>}
      </motion.div>

      {/* 성별 */}
      <motion.div variants={itemVariants} className="space-y-2">
        <label className={designTokens.formLabel}>성별</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors",
              gender === "male"
                ? "bg-blue-600 text-white"
                : designTokens.toggleInactive
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
                : designTokens.toggleInactive
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
