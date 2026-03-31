import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '@shared/stores/useUserStore'
import { useAiStore } from '@shared/stores/useAiStore'
import { useMidiStore } from '@drums/stores/useMidiStore'
import { aiService } from '@drums/services/aiService'
import { CURRICULUM } from '@drums/data/curriculum'
import { SkillProfile } from '@drums/types/curriculum'

export default function DashboardPage() {
  const { progress, totalPracticeTime, practiceStreak } = useUserStore()
  const { suggestion, setSuggestion, isConfigured } = useAiStore()
  const { isConnected } = useMidiStore()

  const currentModule = CURRICULUM.find((m) => m.id === progress.currentModule)
  const completedLessons = progress.completedLessons.length
  const totalLessons = CURRICULUM.reduce((n, m) => n + m.lessons.length, 0)
  const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const recentResults = [...progress.exerciseResults].reverse().slice(0, 5)

  // Find next uncompleted lesson
  const nextLesson = currentModule?.lessons.find(l => !progress.completedLessons.includes(l.id))

  useEffect(() => {
    if (!isConfigured || suggestion) return
    aiService.getDailySuggestion(progress).then(setSuggestion)
  }, [isConfigured])

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">
      <style>{`
        @keyframes dashOrb1 { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.12; } 50% { transform: translateY(-25px) scale(1.06); opacity: 0.2; } }
        @keyframes dashOrb2 { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.06; } 50% { transform: translateY(18px) scale(1.04); opacity: 0.1; } }
        @keyframes dashOrb3 { 0%, 100% { transform: translate(0,0); opacity: 0.04; } 50% { transform: translate(-10px,-12px); opacity: 0.08; } }
        @keyframes dashShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes dashPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes dashFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes streakGlow { 0%, 100% { box-shadow: 0 0 20px -6px rgba(245,158,11,0.3); } 50% { box-shadow: 0 0 35px -4px rgba(245,158,11,0.5); } }
        @keyframes ringProgress { from { stroke-dashoffset: 176; } }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* IMMERSIVE HERO                                                    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.04]" style={{
        background: 'linear-gradient(160deg, rgba(120,53,15,0.15) 0%, rgba(245,158,11,0.06) 20%, rgba(124,58,237,0.04) 50%, rgba(6,8,13,0.97) 80%)',
      }}>
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full" style={{
            top: '-15%', left: '5%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 60%)',
            animation: 'dashOrb1 8s ease-in-out infinite',
          }} />
          <div className="absolute w-[400px] h-[400px] rounded-full" style={{
            bottom: '-25%', right: '10%',
            background: 'radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 55%)',
            animation: 'dashOrb2 10s ease-in-out infinite 2s',
          }} />
          <div className="absolute w-[300px] h-[300px] rounded-full" style={{
            top: '20%', right: '25%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 55%)',
            animation: 'dashOrb3 12s ease-in-out infinite 4s',
          }} />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        <div className="relative z-10 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Left: greeting */}
            <div style={{ animation: 'dashFadeUp 0.6s ease-out' }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{
                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
              }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#f59e0b' }} />
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: '#f59e0b' }}>Drum Tutor</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 leading-[1.08]">
                <span className="text-white">Welcome back</span>
                <span className="bg-clip-text text-transparent" style={{
                  backgroundImage: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 40%, #ea580c 100%)',
                  backgroundSize: '200% auto', animation: 'dashShimmer 5s linear infinite',
                }}>.</span>
              </h1>
              <p className="text-[#8b95a5] text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
                {practiceStreak > 2
                  ? <>You're on a <span className="text-amber-400 font-semibold">{practiceStreak}-day streak</span> — keep that momentum going!</>
                  : practiceStreak > 0
                    ? <>Nice start! <span className="text-amber-400 font-semibold">{practiceStreak} day{practiceStreak > 1 ? 's' : ''}</span> in a row. Build that habit.</>
                    : "Ready to build your rhythm? Let's get behind the kit."}
              </p>
            </div>

            {/* Right: CTA buttons */}
            <div className="flex items-center gap-3" style={{ animation: 'dashFadeUp 0.6s ease-out 0.15s both' }}>
              <Link to="/drums/practice"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                  boxShadow: '0 6px 30px -6px rgba(245,158,11,0.4)',
                }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Start Practice
              </Link>
              <Link to="/drums/curriculum"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/[0.04] border border-white/[0.06] text-[#94a3b8] hover:text-white hover:bg-white/[0.07] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Curriculum
              </Link>
              <Link to="/drums/studio"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm bg-white/[0.04] border border-white/[0.06] text-[#94a3b8] hover:text-white hover:bg-white/[0.07] transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
                Studio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STATS RIBBON — animated cards                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8"
        style={{ animation: 'dashFadeUp 0.5s ease-out 0.2s both' }}>
        {/* Streak */}
        <div className="relative rounded-2xl p-4 border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)',
            borderColor: practiceStreak > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
            animation: practiceStreak > 0 ? 'streakGlow 3s ease-in-out infinite' : undefined,
          }}>
          {practiceStreak > 0 && (
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
          )}
          <div className="relative z-10">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white tracking-tight">{practiceStreak}</span>
              <span className="text-sm text-[#4b5a6a] font-medium">days</span>
            </div>
            <div className="text-[10px] text-[#4b5a6a] mt-1 font-semibold uppercase tracking-wider">Streak</div>
          </div>
        </div>

        {/* Practice time */}
        <div className="relative rounded-2xl p-4 border border-white/[0.04] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)' }}>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">{totalPracticeTime}</span>
            <span className="text-sm text-[#4b5a6a] font-medium">min</span>
          </div>
          <div className="text-[10px] text-[#4b5a6a] mt-1 font-semibold uppercase tracking-wider">Total Practice</div>
        </div>

        {/* Lessons progress */}
        <div className="relative rounded-2xl p-4 border border-white/[0.04] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)' }}>
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white tracking-tight">{completedLessons}</span>
            <span className="text-sm text-[#4b5a6a] font-medium">/ {totalLessons}</span>
          </div>
          <div className="text-[10px] text-[#4b5a6a] mt-1 font-semibold uppercase tracking-wider">Lessons</div>
        </div>

        {/* MIDI status */}
        <div className="relative rounded-2xl p-4 border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)',
            borderColor: isConnected ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)',
          }}>
          {isConnected && (
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)' }} />
          )}
          <div className="relative z-10">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${isConnected ? 'bg-emerald-500/10' : 'bg-white/[0.04]'}`}>
              <svg className={`w-5 h-5 ${isConnected ? 'text-emerald-400' : 'text-[#4b5a6a]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-black tracking-tight ${isConnected ? 'text-emerald-400' : 'text-[#374151]'}`}>{isConnected ? 'ON' : 'OFF'}</span>
            </div>
            <div className="text-[10px] text-[#4b5a6a] mt-1 font-semibold uppercase tracking-wider">MIDI Kit</div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT GRID                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5" style={{ animation: 'dashFadeUp 0.5s ease-out 0.3s both' }}>

        {/* ── Column 1: Learning + Results (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Continue Learning — hero card with progress ring */}
          {currentModule && (
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.04]" style={{
              background: 'linear-gradient(135deg, rgba(12,14,20,0.8) 0%, rgba(15,12,8,0.6) 50%, rgba(10,12,18,0.8) 100%)',
            }}>
              {/* Accent glow */}
              <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full pointer-events-none" style={{
                background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
              }} />

              <div className="relative z-10 p-5 sm:p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-bold text-amber-400/70 uppercase tracking-[0.2em]">Continue Learning</span>
                      {nextLesson && (
                        <span className="px-2 py-0.5 rounded-full text-[8px] font-bold" style={{
                          background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b',
                        }}>Up Next</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{currentModule.name}</h3>
                    <p className="text-sm text-[#6b7280] leading-relaxed">{currentModule.description}</p>
                  </div>

                  {/* Animated progress ring */}
                  <div className="flex-shrink-0 ml-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                        <circle cx="40" cy="40" r="32" fill="none" stroke="url(#dash-ring-grad)" strokeWidth="5" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 - (progressPct / 100) * 2 * Math.PI * 32}
                          style={{ animation: 'ringProgress 1.5s ease-out', transition: 'stroke-dashoffset 1s ease' }}
                        />
                        <defs>
                          <linearGradient id="dash-ring-grad" x1="0" y1="0" x2="80" y2="80">
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-black text-white">{progressPct}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson list */}
                <div className="space-y-1">
                  {currentModule.lessons.slice(0, 5).map((lesson, idx) => {
                    const done = progress.completedLessons.includes(lesson.id)
                    const isNext = !done && nextLesson?.id === lesson.id
                    return (
                      <Link key={lesson.id} to={`/drums/lesson/${currentModule.id}/${lesson.id}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                          isNext ? 'bg-amber-500/[0.06] border border-amber-500/10' : 'hover:bg-white/[0.03]'
                        }`}
                        style={{ animation: `dashFadeUp 0.3s ease-out ${0.4 + idx * 0.05}s both` }}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          done ? 'bg-emerald-500/15 text-emerald-400'
                            : isNext ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20'
                            : 'bg-white/[0.04] text-[#4b5563] group-hover:text-amber-400 group-hover:bg-amber-500/10'
                        }`}>
                          {done ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          ) : lesson.order + 1}
                        </span>
                        <span className={`text-sm flex-1 ${done ? 'text-[#4b5563]' : isNext ? 'text-white font-medium' : 'text-[#c4c9d4]'}`}>
                          {lesson.title}
                        </span>
                        {isNext && (
                          <span className="text-[9px] text-amber-400/60 font-semibold uppercase tracking-wider">Next</span>
                        )}
                        <svg className="w-4 h-4 text-[#2d3748] group-hover:text-amber-500/60 transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )
                  })}
                </div>

                <Link to="/drums/curriculum"
                  className="flex items-center justify-center gap-1.5 mt-4 pt-4 text-xs font-medium text-[#6b7280] hover:text-amber-400 transition-colors"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  View all {CURRICULUM.length} modules
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Recent Practice Results */}
          {recentResults.length > 0 && (
            <div className="rounded-2xl p-5 border border-white/[0.04]" style={{
              background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)',
            }}>
              <span className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-widest">Recent Sessions</span>
              <div className="mt-3 space-y-2">
                {recentResults.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-white/[0.02]"
                    style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.03)', animation: `dashFadeUp 0.3s ease-out ${0.5 + i * 0.06}s both` }}>
                    {/* Score badge */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                      background: r.score >= 80 ? 'rgba(52,211,153,0.1)' : r.score >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.08)',
                      border: `1px solid ${r.score >= 80 ? 'rgba(52,211,153,0.15)' : r.score >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.1)'}`,
                    }}>
                      <span className="text-lg font-black" style={{
                        color: r.score >= 80 ? '#34d399' : r.score >= 50 ? '#f59e0b' : '#ef4444',
                      }}>{r.stars}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white font-medium truncate">
                        {r.exerciseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      </div>
                      <div className="text-xs text-[#4b5563] mt-0.5">{r.bpm} BPM</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-white">{r.score}%</div>
                      <div className="flex gap-0.5 justify-end mt-0.5">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className={`w-3 h-3 ${s <= r.stars ? 'text-amber-400' : 'text-[#1e2433]'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Column 2: Sidebar (1/3) ── */}
        <div className="space-y-5">

          {/* AI Suggestion card */}
          {isConfigured && (
            <div className="relative rounded-2xl p-5 border border-white/[0.04] overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)',
            }}>
              <div className="absolute top-0 left-0 w-full h-[2px]" style={{
                background: 'linear-gradient(90deg, #f59e0b, #ea580c, transparent)',
              }} />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center" style={{
                  animation: suggestion ? undefined : 'dashPulse 2s ease-in-out infinite',
                }}>
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-widest">Today's Focus</span>
              </div>
              {suggestion ? (
                <p className="text-sm text-[#94a3b8] leading-relaxed">{suggestion}</p>
              ) : (
                <div className="space-y-2.5">
                  <div className="h-3 bg-white/[0.04] rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-white/[0.04] rounded-full w-4/5 animate-pulse" style={{ animationDelay: '0.15s' }} />
                  <div className="h-3 bg-white/[0.04] rounded-full w-3/5 animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
              )}
              <Link to="/drums/chat"
                className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-amber-500/70 hover:text-amber-400 transition-colors">
                Ask Max, your AI tutor
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Skill Radar */}
          <div className="rounded-2xl p-5 border border-white/[0.04]" style={{
            background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)',
          }}>
            <span className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-widest">Skill Profile</span>
            <div className="mt-3">
              <SkillRadar profile={progress.skillProfile} />
            </div>
          </div>

          {/* Quick Start — practice mode cards */}
          <div className="rounded-2xl p-5 border border-white/[0.04]" style={{
            background: 'linear-gradient(135deg, rgba(12,14,20,0.7) 0%, rgba(10,12,18,0.8) 100%)',
          }}>
            <span className="text-[10px] font-semibold text-[#4b5563] uppercase tracking-widest">Quick Start</span>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { to: '/drums/practice/beats', label: 'Beats', icon: '🥁', color: '#f59e0b' },
                { to: '/drums/practice/rudiments', label: 'Rudiments', icon: '🔄', color: '#3b82f6' },
                { to: '/drums/practice/reading', label: 'Reading', icon: '👁', color: '#8b5cf6' },
                { to: '/drums/practice/freeplay', label: 'Free Play', icon: '🎵', color: '#10b981' },
                { to: '/drums/practice/fills', label: 'Fills', icon: '💥', color: '#ef4444' },
                { to: '/drums/practice/daily', label: 'Daily', icon: '📅', color: '#06b6d4' },
              ].map(q => (
                <Link key={q.to} to={q.to}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 group cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.015)',
                    borderColor: 'rgba(255,255,255,0.04)',
                  }}>
                  <span className="text-xl" style={{ filter: 'grayscale(30%)' }}>{q.icon}</span>
                  <span className="text-[10px] text-[#6b7280] group-hover:text-white transition-colors font-semibold" style={{
                    // @ts-expect-error -- group-hover style fallback
                    '--tw-group-hover-color': q.color,
                  }}>{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Skill radar chart (pure SVG) ──────────────────────────────────────────────

function SkillRadar({ profile }: { profile: SkillProfile }) {
  const skills = [
    { key: 'timing' as const, label: 'Timing', color: '#f59e0b' },
    { key: 'dynamics' as const, label: 'Dynamics', color: '#3b82f6' },
    { key: 'independence' as const, label: 'Indep.', color: '#06b6d4' },
    { key: 'speed' as const, label: 'Speed', color: '#10b981' },
    { key: 'musicality' as const, label: 'Music.', color: '#ec4899' },
  ]

  const cx = 80, cy = 80, maxR = 60
  const n = skills.length
  const angleStep = (2 * Math.PI) / n
  const startAngle = -Math.PI / 2

  const dataPoints = skills.map((s, i) => {
    const angle = startAngle + i * angleStep
    const r = (profile[s.key] / 100) * maxR
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  const rings = [20, 40, 60, 80, 100]

  return (
    <svg viewBox="0 0 160 170" className="w-full max-w-[220px] mx-auto">
      {rings.map(pct => {
        const r = (pct / 100) * maxR
        const pts = Array.from({ length: n }, (_, i) => {
          const angle = startAngle + i * angleStep
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
        }).join(' ')
        return <polygon key={pct} points={pts} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      })}

      {skills.map((_, i) => {
        const angle = startAngle + i * angleStep
        return <line key={i} x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      })}

      <path d={dataPath} fill="url(#radar-fill)" stroke="url(#radar-stroke)" strokeWidth="1.5" strokeLinejoin="round" />

      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={skills[i].color} stroke="#06080d" strokeWidth="1.5" />
      ))}

      {skills.map((s, i) => {
        const angle = startAngle + i * angleStep
        const labelR = maxR + 15
        return (
          <text key={s.key} x={cx + labelR * Math.cos(angle)} y={cy + labelR * Math.sin(angle)}
            textAnchor="middle" dominantBaseline="central"
            fill="#6b7280" fontSize="8" fontWeight="600" fontFamily="system-ui">
            {s.label}
          </text>
        )
      })}

      <defs>
        <linearGradient id="radar-fill" x1="0" y1="0" x2="160" y2="160">
          <stop offset="0%" stopColor="rgba(245,158,11,0.15)" />
          <stop offset="100%" stopColor="rgba(234,88,12,0.08)" />
        </linearGradient>
        <linearGradient id="radar-stroke" x1="0" y1="0" x2="160" y2="160">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  )
}
