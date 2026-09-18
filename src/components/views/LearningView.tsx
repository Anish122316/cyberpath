import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  Award,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { CURRICULUM_LEVELS } from '../../data/levels';
import { Lesson, LevelCurriculum, UserProfile } from '../../types';

interface LearningViewProps {
  user: UserProfile;
  onCompleteQuiz: (lessonId: string, score: number, maxScore: number) => void;
  onCompleteLesson: (lessonId: string) => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  user,
  onCompleteQuiz,
  onCompleteLesson,
}) => {
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(user.currentLevel || 0);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const currentLevel: LevelCurriculum =
    CURRICULUM_LEVELS.find((lvl) => lvl.levelNumber === selectedLevelNumber) || CURRICULUM_LEVELS[0];

  const currentLesson: Lesson =
    currentLevel.lessons[selectedLessonIndex] || currentLevel.lessons[0];

  const isLevelUnlocked = (lvl: LevelCurriculum) => {
    return user.stars >= lvl.requiredStarsToUnlock || lvl.levelNumber <= user.currentLevel;
  };

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    currentLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });

    setQuizScore(correct);
    setQuizSubmitted(true);
    onCompleteQuiz(currentLesson.id, correct, currentLesson.quiz.length);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            SYSTEMATIC ENGINEERING CURRICULUM
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Levels 0 &ndash; 11: From Beginner to Job Ready
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Theory, real-world examples, defensive diagrams, interview scenarios, and quizzes.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Current Unlocked: <span className="text-emerald-400 font-bold">Level {user.currentLevel}</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
            ★ {user.stars} Stars Available
          </div>
        </div>
      </div>

      {/* Level Selection Tabs (0 - 11) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {CURRICULUM_LEVELS.map((lvl) => {
          const unlocked = isLevelUnlocked(lvl);
          const isSelected = lvl.levelNumber === selectedLevelNumber;

          return (
            <button
              key={lvl.levelNumber}
              onClick={() => {
                if (unlocked) {
                  setSelectedLevelNumber(lvl.levelNumber);
                  setSelectedLessonIndex(0);
                  handleResetQuiz();
                }
              }}
              disabled={!unlocked}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded text-xs font-mono transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                  : unlocked
                  ? 'bg-[#161b22] text-slate-300 hover:bg-slate-800 border border-slate-800'
                  : 'bg-slate-950/60 text-slate-600 border border-slate-900 cursor-not-allowed'
              }`}
              id={`level-tab-${lvl.levelNumber}`}
            >
              {!unlocked && <Lock className="w-3 h-3 text-slate-600" />}
              <span>LVL {lvl.levelNumber}</span>
              <span className="hidden md:inline text-[11px] opacity-80">{lvl.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Learning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Lesson Directory */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800">
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              {currentLevel.codename}
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Level {currentLevel.levelNumber}: {currentLevel.title}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {currentLevel.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Key Competencies:</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {currentLevel.skillsTaught.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#161b22] border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase mb-3">
              Module Content ({currentLevel.lessons.length})
            </div>
            {currentLevel.lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLessonIndex(idx);
                  handleResetQuiz();
                }}
                className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center justify-between ${
                  idx === selectedLessonIndex
                    ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{lesson.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Lesson Theory & Interactive Quiz */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-6">
            {/* Lesson Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                  <span>LEVEL {currentLevel.levelNumber}</span>
                  <span>&bull;</span>
                  <span>MODULE {selectedLessonIndex + 1}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400">{currentLesson.difficulty}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {currentLesson.title}
                </h2>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentLesson.estimatedMinutes} mins</span>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="p-4 rounded-md bg-slate-900/90 border border-slate-800">
              <div className="text-xs font-mono text-emerald-400 font-semibold uppercase mb-2">
                Learning Objectives:
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {currentLesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep Theory & Architectural Breakdowns */}
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              <div className="whitespace-pre-line font-sans">
                {currentLesson.theoryMarkdown}
              </div>
            </div>

            {/* Interview Angle */}
            <div className="p-4 rounded-md bg-[#0d1117] border border-slate-800 border-l-4 border-l-indigo-500">
              <div className="text-xs font-mono text-indigo-400 font-bold uppercase mb-1">
                Technical Interview Angle:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentLesson.interviewAngle}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-md bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-mono text-slate-400 font-semibold uppercase mb-2">
                Key Defensive Takeaways:
              </div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {currentLesson.keyTakeaways.map((kt, i) => (
                  <li key={i}>{kt}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Knowledge Quiz Section */}
          {currentLesson.quiz && currentLesson.quiz.length > 0 && (
            <div className="p-6 rounded-lg bg-[#161b22] border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <span>Module Mastery Quiz ({currentLesson.quiz.length} Questions)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tiered from foundational to advanced scenarios. Scores calibrate your verified competency ledger.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/60">Basic</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-900/60">Intermediate</span>
                  <span>→</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-900/60">Advanced</span>
                </div>
                {quizSubmitted && (
                  <div className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-slate-800">
                    Result: <span className="text-emerald-400 font-bold">{quizScore} / {currentLesson.quiz.length}</span> correct
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {currentLesson.quiz.map((q, qIndex) => {
                  const selected = selectedAnswers[q.id];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div key={q.id} className="p-4 rounded-md bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-semibold text-white leading-relaxed flex-1">
                          <span className="text-emerald-400 font-mono mr-1.5 font-bold">Q{qIndex + 1}.</span> {q.question}
                        </div>
                        {q.difficulty && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium flex-shrink-0 ${
                              q.difficulty === 'Basic'
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'
                                : q.difficulty === 'Intermediate'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
                                : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selected === optIndex;
                          let optionClasses =
                            'border-slate-800 bg-[#161b22] text-slate-300 hover:border-slate-700';

                          if (quizSubmitted) {
                            if (optIndex === q.correctIndex) {
                              optionClasses = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-300 font-semibold';
                            } else if (isOptionSelected && !isCorrect) {
                              optionClasses = 'border-rose-500/80 bg-rose-950/30 text-rose-300';
                            }
                          } else if (isOptionSelected) {
                            optionClasses = 'border-emerald-500 bg-slate-800 text-white font-medium';
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              className={`w-full text-left p-2.5 rounded border text-xs transition-colors flex items-center justify-between ${optionClasses}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
                          <strong className="text-slate-300">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < currentLesson.quiz.length}
                    className="px-5 py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs tracking-wide uppercase transition-colors"
                  >
                    Submit Quiz & Record Evidence
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleResetQuiz}
                      className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={() => onCompleteLesson(currentLesson.id)}
                      className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Complete Lesson & Award Stars
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
