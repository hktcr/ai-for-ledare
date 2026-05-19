/**
 * SlideCraft Component Forge (P6) — Sprint 1+2+3+4
 * 
 * Drop-in module that registers animated slide types:
 *   Sprint 1: word-cascade, box-reveal, bullet-build
 *   Sprint 2: line-chart, comparison, timeline-vertical
 *   Sprint 3: progress-ring, number-wall, bar-race
 *   Sprint 4: giant-text, callout, section-divider, hero-image, outro
 *   Sprint 5: ai-conversation, before-after, prompt-reveal, pitfall
 *   Sprint 6: stat-compare, voice-collage, portrait-quote, reflection
 *   Sprint 7+8: collage, process-chain, acronym-list, map-pins, mindmap
 *   Signature: letter-morph (Håkan-original)
 *
 * Usage: Add <script src="modules/component-forge/component-forge.js"></script>
 *        to any SlideCraft shell.html
 * 
 * Zero-dependency. Monkey-patches slideTypeRegistry.
 */
(function() {
    'use strict';

    // ===== INJECT CSS =====
    const style = document.createElement('style');
    style.textContent = `
        /* ===== WORD CASCADE ===== */
        @keyframes wordDrop {
            0% { opacity: 0; transform: translateY(-28px) scale(0.95); }
            60% { opacity: 1; transform: translateY(4px) scale(1.02); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wordLand {
            0% { opacity: 0; transform: translateY(-28px) scale(0.95); }
            50% { opacity: 1; transform: translateY(6px) scale(1.08); }
            70% { transform: translateY(-2px) scale(1.02); }
            100% { opacity: 1; transform: translateY(0) scale(1); text-shadow: 0 0 30px var(--accent, #f97316); }
        }

        /* ===== SOURCE POPUP ===== */
        .source-toggle-btn {
            position: absolute; bottom: 20px; right: 20px;
            background: rgba(255,255,255,0.05); color: #888;
            border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
            padding: 8px 16px; font-size: 14px; cursor: pointer;
            transition: all 0.2s; z-index: 100;
        }
        .source-toggle-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .source-popup {
            position: absolute; inset: 0; background: rgba(0,0,0,0.8);
            display: flex; justify-content: center; align-items: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s;
            z-index: 1000; backdrop-filter: blur(5px);
        }
        .source-popup.active { opacity: 1; pointer-events: auto; }
        .source-popup-content {
            background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
            padding: 2rem; max-width: 600px; width: 90%; text-align: left;
            transform: translateY(20px); transition: transform 0.3s;
        }
        .source-popup.active .source-popup-content { transform: translateY(0); }
        .source-popup-content h4 { color: #fff; margin-bottom: 1rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
        .source-popup-content ul { list-style: none; padding: 0; margin: 0 0 1.5rem 0; }
        .source-popup-content li { margin-bottom: 0.8rem; }
        .source-popup-content a { color: var(--accent, #f97316); text-decoration: none; font-size: 1.1rem; }
        .source-popup-content a:hover { text-decoration: underline; }
        .source-close-btn {
            background: #333; color: #fff; border: none; padding: 8px 16px;
            border-radius: 6px; cursor: pointer; float: right;
        }
        .source-close-btn:hover { background: #444; }

        .slide-word-cascade {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0.4em;
            padding: 2rem;
            min-height: 60cqh;
        }
        .slide-word-cascade .wc-word {
            font-size: clamp(2rem, 5cqw, 4.5rem);
            font-weight: 700;
            color: var(--text, #f1f5f9);
            opacity: 0;
            display: inline-block;
        }
        .slide-word-cascade .wc-word.wc-emphasis {
            color: var(--accent, #f97316);
            font-style: italic;
        }

        /* ===== BOX REVEAL ===== */
        @keyframes boxBounce {
            0% { opacity: 0; transform: scale(0) rotate(-5deg); }
            50% { opacity: 1; transform: scale(1.08) rotate(1deg); }
            70% { transform: scale(0.97) rotate(-0.5deg); }
            100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes shimmerBorder {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        .slide-box-reveal {
            padding: 2rem;
        }
        .slide-box-reveal h2 {
            text-align: center;
            font-size: clamp(1.5rem, 3cqw, 2.5rem);
            margin-bottom: 2rem;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-box-reveal .br-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        .slide-box-reveal .br-box {
            background: var(--card-bg, #2a2a2a);
            border: 1px solid var(--border, rgba(255,255,255,0.15));
            border-radius: 16px;
            padding: 1.8rem 1.5rem;
            text-align: center;
            opacity: 0;
            position: relative;
            overflow: hidden;
        }
        .slide-box-reveal .br-box::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            padding: 1px;
            background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
            background-size: 200% 100%;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            animation: shimmerBorder 4s ease-in-out infinite;
            pointer-events: none;
        }
        .slide-box-reveal .br-icon {
            font-size: 2.5rem;
            margin-bottom: 0.8rem;
            display: block;
        }
        .slide-box-reveal .br-icon-img {
            width: 48px;
            height: 48px;
            object-fit: contain;
            margin: 0 auto 0.8rem;
            display: block;
        }
        .slide-box-reveal .br-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--accent, #f97316);
            margin-bottom: 0.5rem;
        }
        .slide-box-reveal .br-text {
            font-size: 0.95rem;
            color: var(--text-muted, rgba(255,255,255,0.7));
            line-height: 1.5;
        }

        /* ===== BULLET BUILD ===== */
        @keyframes bulletSlide {
            0% { opacity: 0; transform: translateX(-30px); }
            60% { opacity: 1; transform: translateX(4px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes dotPop {
            0% { transform: scale(0); }
            60% { transform: scale(1.4); }
            100% { transform: scale(1); }
        }
        .slide-bullet-build {
            padding: 2rem 3rem;
            max-width: 900px;
            margin: 0 auto;
        }
        .slide-bullet-build h2 {
            font-size: clamp(1.5rem, 3cqw, 2.5rem);
            margin-bottom: 2rem;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-bullet-build .bb-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .slide-bullet-build .bb-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 0.8rem 0;
            font-size: clamp(1.1rem, 2.2cqw, 1.6rem);
            color: var(--text, #f1f5f9);
            opacity: 0;
            border-bottom: 1px solid var(--border, rgba(255,255,255,0.08));
        }
        .slide-bullet-build .bb-item:last-child {
            border-bottom: none;
        }
        .slide-bullet-build .bb-dot {
            width: 12px;
            height: 12px;
            min-width: 12px;
            border-radius: 50%;
            background: var(--accent, #f97316);
            margin-top: 0.45em;
            opacity: 0;
        }
        .slide-bullet-build .bb-item.bb-emphasis {
            color: var(--accent, #f97316);
            font-weight: 600;
        }
        .slide-bullet-build .bb-subtitle {
            font-size: 0.85em;
            color: var(--text-muted, rgba(255,255,255,0.6));
            margin-top: 0.3rem;
            display: block;
        }

        /* ===== LINE CHART ===== */
        .slide-line-chart {
            padding: 2rem;
            max-width: 900px;
            margin: 0 auto;
        }
        .slide-line-chart h2 {
            text-align: center;
            font-size: clamp(1.3rem, 2.5cqw, 2rem);
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-line-chart .lc-chart {
            position: relative;
            width: 100%;
            aspect-ratio: 16/9;
        }
        .slide-line-chart svg {
            width: 100%;
            height: 100%;
        }
        .slide-line-chart .lc-axis-label {
            fill: var(--text-muted, rgba(255,255,255,0.5));
            font-size: 12px;
            font-family: inherit;
        }
        .slide-line-chart .lc-grid-line {
            stroke: var(--border, rgba(255,255,255,0.1));
            stroke-width: 1;
        }
        .slide-line-chart .lc-data-line {
            fill: none;
            stroke-width: 3;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
        @keyframes drawLine {
            to { stroke-dashoffset: 0; }
        }
        .slide-line-chart .lc-dot {
            opacity: 0;
            cursor: pointer;
            transition: r 0.2s, filter 0.2s;
        }
        .slide-line-chart .lc-dot:hover {
            filter: brightness(1.5);
        }
        .slide-line-chart .lc-point-label {
            fill: var(--text, rgba(255,255,255,0.9));
            font-size: 0.75rem;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            pointer-events: none;
            opacity: 0;
            animation: wordDrop 0.4s ease forwards;
        }
        .slide-line-chart .lc-paused-stage {
            animation-play-state: paused !important;
            opacity: 0 !important;
        }
        .slide-line-chart .lc-reveal-stage {
            animation-play-state: running !important;
            opacity: 1 !important;
        }
        .slide-line-chart.lc-paused h2,
        .slide-line-chart.lc-paused .lc-data-line,
        .slide-line-chart.lc-paused .lc-dot,
        .slide-line-chart.lc-paused .lc-point-label {
            animation-play-state: paused !important;
        }
        .lc-intro-overlay {
            position: absolute; inset: 0; z-index: 50; 
            display: flex; flex-direction: column; align-items: center; justify-content: center; 
            background: var(--bg); border-radius: 12px;
            transition: opacity 0.5s ease;
        }
        @keyframes dotAppear {
            0% { opacity: 0; r: 0; }
            60% { opacity: 1; r: 7; }
            100% { opacity: 1; r: 5; }
        }
        .lc-tooltip {
            position: absolute;
            background: rgba(15, 23, 42, 0.95);
            border: 1px solid var(--accent, #f97316);
            padding: 1.2rem 1.5rem;
            border-radius: 10px;
            color: #fff;
            font-size: 1.25rem;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -100%) translateY(-10px);
            transition: opacity 0.2s, transform 0.2s;
            z-index: 100;
            white-space: nowrap;
            box-shadow: 0 8px 30px rgba(0,0,0,0.7);
        }
        .lc-tooltip.visible {
            opacity: 1;
            /* Transform styrs numera dynamiskt i JS för att hantera taket */
        }
        .lc-tooltip-title {
            font-weight: bold;
            color: var(--accent, #f97316);
            margin-bottom: 0.5rem;
            font-size: 1.5rem;
        }
        .slide-line-chart .lc-legend {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
            opacity: 0;
            animation: wordDrop 0.5s ease 2.5s forwards;
        }
        .slide-line-chart .lc-legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
            color: var(--text-muted, rgba(255,255,255,0.7));
        }
        .slide-line-chart .lc-legend-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        /* ===== COMPARISON ===== */
        @keyframes slideFromLeft {
            from { opacity: 0; transform: translateX(-60px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideFromRight {
            from { opacity: 0; transform: translateX(60px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes highlightPulse {
            0%, 100% { background: rgba(var(--accent-rgb, 249,115,22), 0.08); }
            50% { background: rgba(var(--accent-rgb, 249,115,22), 0.18); }
        }
        .slide-comparison {
            padding: 2cqh 4cqw;
            max-width: 950px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            box-sizing: border-box;
        }
        .slide-comparison h2 {
            text-align: center;
            font-size: clamp(1.1rem, 4cqh, 2rem);
            margin-bottom: 1.5cqh;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-comparison .cmp-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 0;
            align-items: stretch;
        }
        .slide-comparison .cmp-col {
            opacity: 0;
            padding: 1cqh 2cqw;
        }
        .slide-comparison .cmp-col.cmp-left {
            animation: slideFromLeft 0.7s ease 0.3s forwards;
        }
        .slide-comparison .cmp-col.cmp-right {
            animation: slideFromRight 0.7s ease 0.5s forwards;
        }
        .slide-comparison .cmp-divider {
            width: 2px;
            background: linear-gradient(180deg, transparent, var(--accent, #f97316), transparent);
            opacity: 0;
            animation: wordDrop 0.5s ease 0.4s forwards;
        }
        .slide-comparison .cmp-label {
            font-size: clamp(0.85rem, 2.5cqh, 1.3rem);
            font-weight: 700;
            color: var(--accent, #f97316);
            margin-bottom: 1cqh;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .slide-comparison .cmp-item {
            padding: 1cqh 1.5cqw;
            margin-bottom: 0.8cqh;
            border-radius: 0.8cqh;
            font-size: clamp(0.75rem, 2.2cqh, 1.1rem);
            color: var(--text, #f1f5f9);
            background: var(--card-bg, #2a2a2a);
            border: 1px solid var(--border, rgba(255,255,255,0.1));
            transition: background 0.3s;
            line-height: 1.3;
        }
        .slide-comparison .cmp-item.cmp-highlight {
            border-color: var(--accent, #f97316);
            animation: highlightPulse 3s ease-in-out 1.5s infinite;
        }

        /* ===== TIMELINE VERTICAL ===== */
        @keyframes drawDown {
            from { height: 0; }
            to { height: 100%; }
        }
        @keyframes nodePopIn {
            0% { opacity: 0; transform: scale(0) translateX(-50%); }
            60% { opacity: 1; transform: scale(1.15) translateX(-50%); }
            100% { opacity: 1; transform: scale(1) translateX(-50%); }
        }
        .slide-timeline-v {
            padding: 2cqh 6cqw;
            max-width: 75cqw;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            box-sizing: border-box;
        }
        .slide-timeline-v h2 {
            text-align: center;
            font-size: clamp(1.2rem, 5cqh, 2.5rem);
            margin-bottom: 2cqh;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-timeline-v .tv-track {
            position: relative;
            padding-left: 8cqw;
            margin-top: 1cqh;
        }
        .slide-timeline-v .tv-line {
            position: absolute;
            left: 2.7cqw;
            top: 0;
            width: 0.5cqw;
            height: 0;
            background: linear-gradient(180deg, var(--accent, #f97316), var(--accent2, #a855f7));
            border-radius: 0.25cqw;
            animation: drawDown 2s ease 0.3s forwards;
        }
        .slide-timeline-v .tv-node {
            position: relative;
            padding: 0.8cqh 0 1.8cqh 3cqw;
            opacity: 0;
        }
        .slide-timeline-v .tv-dot {
            position: absolute;
            left: -6.1cqw;
            top: clamp(4px, 1.4cqh, 20px);
            width: clamp(12px, 1.6cqw, 18px);
            height: clamp(12px, 1.6cqw, 18px);
            border-radius: 50%;
            background: var(--accent, #f97316);
            border: 0.3cqw solid var(--bg, #000);
            opacity: 0;
            z-index: 2;
        }
        .slide-timeline-v .tv-year {
            font-size: clamp(0.7rem, 2cqh, 1.1rem);
            font-weight: 700;
            color: var(--accent, #f97316);
            letter-spacing: 0.05em;
            margin-bottom: 0.2cqh;
        }
        .slide-timeline-v .tv-text {
            font-size: clamp(0.9rem, 3.2cqh, 1.4rem);
            font-weight: 600;
            color: var(--text, #f1f5f9);
            line-height: 1.25;
        }
        .slide-timeline-v .tv-sub {
            font-size: clamp(0.75rem, 2.2cqh, 1.1rem);
            color: var(--text-muted, rgba(255,255,255,0.6));
            margin-top: 0.2cqh;
            line-height: 1.35;
        }

        /* ===== PROGRESS RING ===== */
        @keyframes ringFill {
            to { stroke-dashoffset: var(--ring-target); }
        }
        .slide-progress-ring {
            padding: 2rem;
            text-align: center;
        }
        .slide-progress-ring h2 {
            font-size: clamp(1.3rem, 2.5cqw, 2rem);
            margin-bottom: 1.5rem;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-progress-ring .pr-wrap {
            position: relative;
            display: inline-block;
        }
        .slide-progress-ring svg {
            transform: rotate(-90deg);
        }
        .slide-progress-ring .pr-bg {
            fill: none;
            stroke: var(--surface, #1a1a1a);
            stroke-width: 12;
        }
        .slide-progress-ring .pr-fg {
            fill: none;
            stroke-width: 12;
            stroke-linecap: round;
        }
        .slide-progress-ring .pr-center {
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }
        .slide-progress-ring .pr-value {
            font-size: clamp(3rem, 8cqw, 6rem);
            font-weight: 700;
            color: var(--text, #f1f5f9);
            line-height: 1;
        }
        .slide-progress-ring .pr-unit {
            font-size: 0.4em;
            color: var(--text-muted, rgba(255,255,255,0.6));
        }
        .slide-progress-ring .pr-subtitle {
            font-size: 0.95rem;
            color: var(--text-muted, rgba(255,255,255,0.6));
            margin-top: 1rem;
            opacity: 0;
            animation: wordDrop 0.5s ease 2.5s forwards;
        }

        /* ===== NUMBER WALL ===== */
        .slide-number-wall {
            padding: 2rem;
        }
        .slide-number-wall h2 {
            text-align: center;
            font-size: clamp(1.3rem, 2.5cqw, 2rem);
            margin-bottom: 2rem;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-number-wall .nw-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.5rem;
            max-width: 900px;
            margin: 0 auto;
        }
        .slide-number-wall .nw-cell {
            text-align: center;
            padding: 1.5rem 1rem;
            background: var(--card-bg, #2a2a2a);
            border: 1px solid var(--border, rgba(255,255,255,0.1));
            border-radius: 16px;
            opacity: 0;
        }
        .slide-number-wall .nw-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
        }
        .slide-number-wall .nw-icon-img {
            width: 36px;
            height: 36px;
            object-fit: contain;
            margin: 0 auto 0.5rem;
            display: block;
        }
        .slide-number-wall .nw-value {
            font-size: clamp(2.2rem, 5cqw, 3.5rem);
            font-weight: 700;
            color: var(--accent, #f97316);
            line-height: 1.1;
        }
        .slide-number-wall .nw-label {
            font-size: 0.9rem;
            color: var(--text-muted, rgba(255,255,255,0.6));
            margin-top: 0.3rem;
        }
        .slide-number-wall.nw-paused h2,
        .slide-number-wall.nw-paused .nw-cell {
            animation-play-state: paused !important;
        }

        /* ===== PROMPT CARD ===== */
        .slide-prompt-card {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            padding: clamp(1rem, 3cqw, 3rem); max-width: 1000px; margin: 0 auto; width: 100%;
            text-align: center;
        }
        .slide-prompt-card .pc-eyebrow {
            font-size: clamp(0.75rem, 1.2cqw, 1rem); font-weight: 700; letter-spacing: 0.15em;
            text-transform: uppercase; color: var(--accent, #f97316);
            opacity: 0; animation: wordDrop 0.5s ease 0.1s forwards;
        }
        .slide-prompt-card .pc-title {
            font-size: clamp(1.4rem, 3cqw, 2.2rem); font-weight: 900;
            margin: 0.8rem 0 1.5rem; line-height: 1.2;
            opacity: 0; animation: wordDrop 0.5s ease 0.3s forwards;
        }
        .slide-prompt-card .pc-box {
            width: 100%; background: rgba(255,255,255,0.04);
            border: 1.5px solid rgba(249,115,22,0.35);
            border-radius: 16px; padding: clamp(1.2rem, 3cqw, 2.5rem);
            text-align: left; position: relative;
            box-shadow: 0 0 40px rgba(249,115,22,0.08), inset 0 0 30px rgba(255,255,255,0.02);
            opacity: 0; animation: wordDrop 0.6s ease 0.5s forwards;
        }
        .slide-prompt-card .pc-prompt {
            font-size: clamp(1.05rem, 1.8cqw, 1.5rem); line-height: 1.75;
            color: var(--text, #f1f5f9); font-family: 'JetBrains Mono', monospace;
            white-space: pre-wrap; word-break: break-word;
        }
        .slide-prompt-card .pc-copy-btn {
            position: absolute; top: 1rem; right: 1rem;
            background: var(--accent, #f97316); color: white;
            border: none; border-radius: 8px;
            padding: clamp(0.4rem, 0.8cqw, 0.6rem) clamp(0.8rem, 1.5cqw, 1.2rem);
            font-size: clamp(0.8rem, 1.2cqw, 1rem); font-weight: 700;
            cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem;
            box-shadow: 0 4px 15px rgba(249,115,22,0.3);
        }
        .slide-prompt-card .pc-copy-btn:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(249,115,22,0.45); }
        .slide-prompt-card .pc-copy-btn.copied { background: var(--green, #22c55e); box-shadow: 0 4px 15px rgba(34,197,94,0.4); }
        .slide-prompt-card .pc-hint {
            font-size: clamp(0.75rem, 1.1cqw, 0.95rem); color: var(--text-muted, rgba(255,255,255,0.5));
            margin-top: 1.2rem; font-style: italic;
            opacity: 0; animation: wordDrop 0.5s ease 0.9s forwards;
        }

        /* ===== SOURCE CITATION POPUP ===== */
        .source-toggle-btn {
            position: absolute; bottom: 1.5rem; right: 2rem;
            background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
            color: var(--text-muted); padding: 0.5rem 1rem; border-radius: 20px;
            font-size: 0.8rem; font-family: 'Inter', sans-serif; cursor: pointer;
            transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem;
            opacity: 0; animation: fadeUp 0.5s forwards 1.2s; z-index: 10;
        }
        .source-toggle-btn:hover { background: rgba(255,255,255,0.2); color: white; transform: scale(1.05); }
        .source-popup {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
            display: flex; align-items: center; justify-content: center;
            opacity: 0; pointer-events: none; transition: opacity 0.3s; z-index: 50;
        }
        .source-popup.active { opacity: 1; pointer-events: auto; }
        .source-popup-content {
            background: rgba(15, 23, 42, 0.95); border: 1px solid var(--accent);
            padding: 2rem 3rem; border-radius: 16px; max-width: 600px; width: 90%;
            transform: scale(0.95); opacity: 0;
            box-shadow: 0 0 0 0 rgba(249,115,22,0);
        }
        .source-popup.active .source-popup-content {
            animation: pulseIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes pulseIn {
            0% { transform: scale(0.9); opacity: 0; box-shadow: 0 0 0 0 rgba(249,115,22, 0); }
            50% { transform: scale(1.02); opacity: 1; box-shadow: 0 0 40px 15px rgba(249,115,22, 0.4); }
            100% { transform: scale(1); opacity: 1; box-shadow: 0 0 20px 0 rgba(249,115,22, 0.2); }
        }
        .source-popup h4 { color: var(--accent); margin-bottom: 1rem; font-size: 1.2rem; display:flex; align-items:center; gap:0.5rem; }
        .source-popup ul { list-style: none; padding: 0; margin: 0 0 1.5rem 0; display:flex; flex-direction:column; gap:0.8rem; }
        .source-popup a { color: var(--text); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.2); transition: all 0.2s; display:inline-block; }
        .source-popup a:hover { color: white; border-bottom-color: white; }
        .source-close-btn {
            background: transparent; border: 1px solid var(--text-muted); color: var(--text-muted);
            padding: 0.4rem 1.2rem; border-radius: 8px; cursor: pointer; transition: all 0.2s;
        }
        .source-close-btn:hover { background: rgba(255,255,255,0.1); color: white; }

        /* ===== BENTO GRID ===== */
        .slide-bento-grid {
            display: flex; flex-direction: column; height: 100%; width: 100%;
            padding: 2cqh 4cqw; box-sizing: border-box; justify-content: center; position: relative;
            overflow: hidden;
        }
        .bento-title { font-size: clamp(1.8rem, 4cqh, 3rem); margin-bottom: 1.5cqh; font-weight: 700; color: var(--text); }
        .bento-container {
            display: grid; grid-template-columns: repeat(var(--bento-cols, 3), 1fr);
            gap: clamp(0.5rem, 1.5cqh, 1.5rem); width: 100%; max-width: 1200px; margin: 0 auto;
            flex: 1; max-height: 85cqh;
        }
        .bento-item {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
            border-radius: clamp(12px, 2cqw, 24px); padding: clamp(0.8rem, 2cqh, 2rem); display: flex; flex-direction: column;
            backdrop-filter: blur(10px); transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            opacity: 1; transform: translateY(0);
            min-height: 0; overflow: hidden;
        }
        .bento-item.step-hidden {
            opacity: 0; transform: translateY(30px);
        }
        .bento-icon { font-size: clamp(2rem, 4cqw, 3rem); margin-bottom: clamp(0.3rem, 1cqh, 1rem); }
        .bento-icon-img { width: 100%; height: clamp(60px, 15cqh, 160px); object-fit: cover; border-radius: clamp(6px, 1cqw, 12px); margin-bottom: clamp(0.3rem, 1cqh, 1rem); }
        .bento-item-title { font-size: clamp(1.2rem, 2.5cqw, 2.2rem); margin-bottom: 0.3rem; color: white; font-weight: 600; }
        .bento-item-text { font-size: clamp(0.9rem, 1.8cqw, 1.4rem); color: var(--text-muted); line-height: 1.4; }

        /* ===== GLITCH WARNING ===== */
        @keyframes bgPulseDanger {
            0% { background-color: #4a0404; }
            50% { background-color: #700f0f; }
            100% { background-color: #4a0404; }
        }
        @keyframes glitchAnim {
            0% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75); transform: translate(0); }
            14% { text-shadow: 0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75); transform: translate(0); }
            15% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75), 0.025em 0.025em 0 rgba(0,255,0,0.75), -0.05em -0.05em 0 rgba(0,0,255,0.75); transform: translate(-2px, 1px); }
            49% { text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75), 0.025em 0.025em 0 rgba(0,255,0,0.75), -0.05em -0.05em 0 rgba(0,0,255,0.75); transform: translate(-2px, 1px); }
            50% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75), 0.05em 0 0 rgba(0,255,0,0.75), 0 -0.05em 0 rgba(0,0,255,0.75); transform: translate(2px, -2px); }
            99% { text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75), 0.05em 0 0 rgba(0,255,0,0.75), 0 -0.05em 0 rgba(0,0,255,0.75); transform: translate(2px, -2px); }
            100% { text-shadow: -0.025em 0 0 rgba(255,0,0,0.75), -0.025em -0.025em 0 rgba(0,255,0,0.75), -0.025em -0.05em 0 rgba(0,0,255,0.75); transform: translate(0); }
        }
        @keyframes scanline {
            0% { transform: translateY(-100cqh); }
            100% { transform: translateY(100cqh); }
        }
        .slide-glitch-warning {
            display: flex; flex-direction: column; height: 100%; width: 100%;
            justify-content: center; align-items: center; 
            background: radial-gradient(circle at center, #7f1d1d 0%, #450a0a 100%); position: relative;
            padding: 2rem 5cqw; box-sizing: border-box; overflow: hidden;
            animation: bgPulseDanger 4s ease-in-out infinite;
        }
        .slide-glitch-warning::after {
            content: ""; position: absolute; inset: 0; width: 100%; height: 30px;
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.1) 50%, rgba(255,255,255,0));
            animation: scanline 4s linear infinite; pointer-events: none; z-index: 10;
        }
        .glitch-wrapper { text-align: center; width: 100%; max-width: 900px; display: flex; flex-direction: column; align-items: center; z-index: 2; position: relative; }
        .glitch {
            font-size: clamp(3rem, 10cqw, 7rem); font-weight: 900; text-transform: uppercase;
            position: relative; color: #fff; margin-bottom: 0.5rem; line-height: 1.1; letter-spacing: -0.02em;
            animation: glitchAnim 2.5s infinite; word-break: break-word; hyphens: auto;
        }
        .glitch-subtitle { 
            font-size: clamp(1.1rem, 2.8cqw, 2rem); color: #fca5a5; margin-bottom: 2.5rem; 
            font-weight: 700; text-transform: uppercase; letter-spacing: 4px;
            border-bottom: 2px solid rgba(252,165,165,0.4); padding-bottom: 1rem;
            text-shadow: 0 0 10px rgba(252,165,165,0.3);
        }
        .glitch-list { display: flex; flex-direction: column; gap: 1.2rem; width: 100%; max-width: 800px; text-align: left; perspective: 1000px; }
        .glitch-list-item {
            font-size: clamp(1.2rem, 2.2cqw, 1.6rem); color: #fff; background: rgba(0,0,0,0.3);
            padding: clamp(1.2rem, 3cqw, 1.8rem); border-left: 5px solid #ef4444; border-radius: 4px 12px 12px 4px;
            opacity: 1; transform: rotateX(0deg) translateY(0); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            line-height: 1.5; display: flex; gap: 1rem; align-items: flex-start;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
        }
        .glitch-list-item::before { content: "⚠️"; flex-shrink: 0; font-size: 1.3em; filter: drop-shadow(0 0 5px rgba(239,68,68,0.8)); }
        .glitch-list-item.step-hidden {
            opacity: 0; transform: rotateX(45deg) translateY(30px);
        }

        /* ===== MILESTONE REVEAL ===== */
        .slide-milestone {
            display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; position: relative;
        }
        .ms-date-btn {
            background: transparent; border: 2px solid var(--text-muted); color: var(--text);
            font-size: clamp(3rem, 6cqw, 5rem); font-weight: 900; font-family: 'JetBrains Mono', monospace;
            padding: 1rem 3rem; border-radius: 100px; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 0 rgba(249,115,22,0); position: relative; overflow: hidden;
        }
        .ms-date-btn:hover { border-color: var(--accent); color: var(--accent); transform: scale(1.05); }
        .ms-date-btn.revealed {
            border-color: var(--accent); background: var(--accent); color: white;
            font-size: 2rem; padding: 0.5rem 2rem; transform: translateY(-50px);
            box-shadow: 0 10px 40px rgba(249,115,22,0.4); pointer-events: none;
        }
        .ms-content {
            opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            text-align: center; margin-top: 2rem; pointer-events: none; position: absolute; top: 50%;
        }
        .ms-date-btn.revealed + .ms-content {
            opacity: 1; transform: translateY(10px); pointer-events: auto; position: relative; top: auto;
        }
        .ms-eyebrow { color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; font-size: clamp(1.2rem, 2cqw, 1.8rem); }
        .ms-title { font-size: clamp(2.5rem, 5cqw, 4rem); font-weight: 900; margin-bottom: 2rem; }
        .ms-features { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .ms-feature { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem 2rem; border-radius: 12px; font-weight: 700; font-size: clamp(1.2rem, 2cqw, 1.8rem); max-width: 400px; text-align: left; }

        /* ===== BAR RACE ===== */
        @keyframes barGrow {
            from { width: 0; }
        }
        @keyframes barPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(var(--bar-rgb, 255,255,255), 0.3); }
            50% { box-shadow: 0 0 12px 4px rgba(var(--bar-rgb, 255,255,255), 0.15); }
        }
        .slide-bar-race {
            padding: 2rem 3rem;
            max-width: 850px;
            margin: 0 auto;
        }
        .slide-bar-race h2 {
            text-align: center;
            font-size: clamp(1.3rem, 2.5cqw, 2rem);
            margin-bottom: 2rem;
            opacity: 0;
            animation: wordDrop 0.6s ease 0.1s forwards;
        }
        .slide-bar-race .brc-row {
            display: grid;
            grid-template-columns: 120px 1fr 50px;
            align-items: center;
            gap: 0.8rem;
            margin-bottom: 0.8rem;
            opacity: 0;
        }
        .slide-bar-race .brc-label {
            font-size: clamp(0.85rem, 1.5cqw, 1.05rem);
            color: var(--text, #f1f5f9);
            text-align: right;
            font-weight: 600;
        }
        .slide-bar-race .brc-track {
            height: 32px;
            background: var(--surface, #1a1a1a);
            border-radius: 8px;
            overflow: hidden;
            position: relative;
        }
        .slide-bar-race .brc-bar {
            height: 100%;
            border-radius: 8px;
            position: relative;
        }
        .slide-bar-race .brc-val {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-muted, rgba(255,255,255,0.6));
        }
        .slide-bar-race .brc-row.brc-leader .brc-val {
            color: var(--accent, #f97316);
        }

        /* ===== SHARED: Slide active overrides ===== */
        .slide-word-cascade,
        .slide-box-reveal,
        .slide-bullet-build,
        .slide-line-chart,
        .slide-comparison,
        .slide-timeline-v,
        .slide-progress-ring,
        .slide-number-wall,
        .slide-bar-race {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 70cqh;
            position: relative;
        }
        .slide-word-cascade {
            flex-direction: row;
            flex-wrap: wrap;
            align-content: center;
        }

        /* ===== SPRINT 4: GIANT TEXT ===== */
        @keyframes gtWordFade {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .slide-giant-text {
            display: flex; flex-direction: column; align-items: flex-start;
            justify-content: center; padding: 3rem 5rem; min-height: 70cqh;
            position: relative; overflow: hidden;
        }
        .slide-giant-text.gt-center { align-items: center; text-align: center; }
        .slide-giant-text .gt-decoration {
            position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
            font-size: clamp(15rem, 35cqw, 45rem); font-weight: 900;
            color: var(--accent, #f97316); opacity: 0.07; line-height: 1;
            pointer-events: none; z-index: 0;
        }
        .slide-giant-text .gt-text {
            position: relative; z-index: 1;
            font-size: clamp(2.5rem, 7cqw, 7rem); font-weight: 700;
            line-height: 1.15; color: var(--text, #f1f5f9);
        }
        .slide-giant-text .gt-text .gt-bold {
            color: var(--accent, #f97316); font-weight: 800;
        }
        .slide-giant-text .gt-text .gt-word {
            display: inline-block; opacity: 0; margin-right: 0.25em;
            animation: gtWordFade 0.5s ease-out forwards;
        }
        .slide-giant-text.gt-serif .gt-text { font-family: Georgia, 'Times New Roman', serif; font-style: italic; }

        /* ===== SPRINT 4: CALLOUT ===== */
        @keyframes calloutEnter {
            0% { opacity: 0; transform: scale(0.92); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes calloutPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.1); }
            50% { box-shadow: 0 0 25px 5px rgba(255,255,255,0.15); }
        }
        .slide-callout {
            display: flex; align-items: center; justify-content: center;
            padding: 3rem 5rem; min-height: 70cqh;
        }
        .slide-callout .co-box {
            max-width: 700px; padding: 2.5rem 3rem;
            border-radius: 16px; border-left: 5px solid var(--co-color, var(--accent, #f97316));
            background: rgba(255,255,255,0.06);
            animation: calloutEnter 0.6s ease-out;
        }
        .slide-callout .co-box.co-pulsate {
            animation: calloutEnter 0.6s ease-out, calloutPulse 3s ease-in-out 1s infinite;
        }
        .slide-callout .co-tag {
            font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;
            color: var(--co-color, var(--accent, #f97316)); margin-bottom: 0.5rem; font-weight: 600;
        }
        .slide-callout .co-title {
            font-size: clamp(1.5rem, 3cqw, 2.5rem); font-weight: 700;
            color: var(--text, #f1f5f9); margin-bottom: 0.75rem;
        }
        .slide-callout .co-body {
            font-size: 1.15rem; color: var(--text, #f1f5f9); opacity: 0.85; line-height: 1.6;
        }
        .slide-callout .co-items { list-style: none; padding: 0; margin: 0.75rem 0 0; }
        .slide-callout .co-items li {
            padding: 0.3rem 0; padding-left: 1.2rem; position: relative;
            color: var(--text, #f1f5f9); opacity: 0.85;
        }
        .slide-callout .co-items li::before {
            content: ''; position: absolute; left: 0; top: 0.7rem;
            width: 6px; height: 6px; border-radius: 50%;
            background: var(--co-color, var(--accent, #f97316));
        }

        /* ===== SPRINT 4: SECTION DIVIDER ===== */
        @keyframes sdNumberGlow {
            0%, 100% { text-shadow: 0 0 40px rgba(255,255,255,0.1); }
            50% { text-shadow: 0 0 80px var(--accent, #f97316); }
        }
        .slide-section-divider {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh; text-align: center;
        }
        .slide-section-divider .sd-number {
            font-size: clamp(5rem, 15cqw, 14rem); font-weight: 900;
            color: var(--accent, #f97316); opacity: 0.3; line-height: 1;
            animation: sdNumberGlow 4s ease-in-out infinite;
        }
        .slide-section-divider.sd-hero .sd-number { opacity: 0.5; }
        .slide-section-divider .sd-title {
            font-size: clamp(2rem, 5cqw, 4rem); font-weight: 700;
            color: var(--text, #f1f5f9); margin-top: -0.5rem;
        }
        .slide-section-divider .sd-subtitle {
            font-size: 1.2rem; color: var(--text, #f1f5f9); opacity: 0.6;
            margin-top: 0.5rem; max-width: 500px;
        }
        .slide-section-divider .sd-duration {
            font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em;
            color: var(--accent, #f97316); margin-top: 1rem; opacity: 0.7;
        }
        .slide-section-divider .sd-progress {
            width: 200px; height: 3px; background: rgba(255,255,255,0.1);
            border-radius: 3px; margin-top: 1.5rem; overflow: hidden;
        }
        .slide-section-divider .sd-progress-fill {
            height: 100%; background: var(--accent, #f97316); border-radius: 3px;
            transition: width 0.8s ease-out;
        }

        /* ===== SPRINT 4: HERO IMAGE ===== */
        @keyframes hiKenBurns {
            0% { transform: scale(1.05) translate(0, 0); }
            50% { transform: scale(1.1) translate(-1%, -1%); }
            100% { transform: scale(1.05) translate(0, 0); }
        }
        .slide-hero-image {
            position: relative; min-height: 70cqh; display: flex;
            overflow: hidden;
        }
        .slide-hero-image .hi-bg {
            position: absolute; inset: 0; background-size: cover;
            background-position: center; z-index: 0;
        }
        .slide-hero-image .hi-bg.hi-kenburns { animation: hiKenBurns 15s ease-in-out infinite; }
        .slide-hero-image .hi-gradient {
            position: absolute; inset: 0; z-index: 1;
        }
        .slide-hero-image .hi-gradient.hi-grad-bottom {
            background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
        }
        .slide-hero-image .hi-gradient.hi-grad-top {
            background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 60%);
        }
        .slide-hero-image .hi-gradient.hi-grad-left {
            background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, transparent 60%);
        }
        .slide-hero-image .hi-gradient.hi-grad-radial {
            background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);
        }
        .slide-hero-image .hi-content {
            position: relative; z-index: 2; padding: 3rem 4rem;
            display: flex; flex-direction: column; justify-content: flex-end;
            width: 100%; max-width: 700px;
        }
        .slide-hero-image .hi-content.hi-pos-tl { justify-content: flex-start; align-self: flex-start; }
        .slide-hero-image .hi-content.hi-pos-tc { justify-content: flex-start; align-self: center; text-align: center; }
        .slide-hero-image .hi-content.hi-pos-tr { justify-content: flex-start; align-self: flex-end; }
        .slide-hero-image .hi-content.hi-pos-cl { justify-content: center; align-self: flex-start; }
        .slide-hero-image .hi-content.hi-pos-cc { justify-content: center; align-self: center; text-align: center; }
        .slide-hero-image .hi-content.hi-pos-cr { justify-content: center; align-self: flex-end; }
        .slide-hero-image .hi-content.hi-pos-bl { justify-content: flex-end; align-self: flex-start; }
        .slide-hero-image .hi-content.hi-pos-bc { justify-content: flex-end; align-self: center; text-align: center; }
        .slide-hero-image .hi-content.hi-pos-br { justify-content: flex-end; align-self: flex-end; text-align: right; }
        .slide-hero-image .hi-title {
            font-size: clamp(2rem, 5cqw, 4rem); font-weight: 700;
            color: #fff; text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }
        .slide-hero-image .hi-subtitle {
            font-size: 1.2rem; color: rgba(255,255,255,0.85); margin-top: 0.5rem;
            text-shadow: 0 1px 10px rgba(0,0,0,0.5);
        }

        /* ===== SPRINT 4: OUTRO ===== */
        @keyframes outroFadeUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .slide-outro {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh; text-align: center;
        }
        .slide-outro .ou-title {
            font-size: clamp(3rem, 8cqw, 6rem); font-weight: 800;
            color: var(--text, #f1f5f9); margin-bottom: 0.5rem;
            animation: outroFadeUp 0.8s ease-out;
        }
        .slide-outro .ou-subtitle {
            font-size: 1.3rem; color: var(--text, #f1f5f9); opacity: 0.7;
            margin-bottom: 2rem; animation: outroFadeUp 0.8s ease-out 0.2s both;
        }
        .slide-outro .ou-contacts {
            display: flex; gap: 2rem; flex-wrap: wrap; justify-content: center;
            margin-bottom: 1.5rem; animation: outroFadeUp 0.8s ease-out 0.4s both;
        }
        .slide-outro .ou-contact {
            font-size: 1rem; color: var(--accent, #f97316); opacity: 0.9;
        }
        .slide-outro .ou-qr-section {
            display: flex; gap: 2rem; align-items: center;
            animation: outroFadeUp 0.8s ease-out 0.6s both;
        }
        .slide-outro .ou-qr-block { text-align: center; }
        .slide-outro .ou-qr-block img {
            width: 140px; height: 140px; border-radius: 12px;
            background: #fff; padding: 8px;
        }
        .slide-outro .ou-qr-caption {
            font-size: 0.8rem; color: var(--text, #f1f5f9); opacity: 0.6; margin-top: 0.4rem;
        }
        .slide-outro .ou-cta {
            margin-top: 1.5rem; font-size: 1.1rem; font-weight: 600;
            color: var(--accent, #f97316);
            animation: outroFadeUp 0.8s ease-out 0.8s both;
        }
        .slide-outro .ou-next-steps {
            list-style: none; padding: 0; margin: 1rem 0 0;
            animation: outroFadeUp 0.8s ease-out 0.7s both;
        }
        .slide-outro .ou-next-steps li {
            padding: 0.3rem 0; color: var(--text, #f1f5f9); opacity: 0.8;
        }
        .slide-outro .ou-next-steps li::before {
            content: ''; display: inline-block; width: 8px; height: 8px;
            border-radius: 50%; background: var(--accent, #f97316);
            margin-right: 0.7rem; vertical-align: middle;
        }

        /* ===== SPRINT 5: AI CONVERSATION ===== */
        @keyframes aicDotPulse {
            0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
        }
        @keyframes aicMsgIn {
            0% { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .slide-ai-conversation {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 2rem 3rem; min-height: 70cqh;
        }
        .slide-ai-conversation .aic-title {
            font-size: 1.4rem; font-weight: 700; color: var(--text, #f1f5f9);
            margin-bottom: 1.5rem; text-align: center;
        }
        .slide-ai-conversation .aic-chat {
            width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 0.6rem;
            background: rgba(255,255,255,0.04); border-radius: 16px; padding: 1.5rem;
            max-height: 55cqh; overflow-y: auto;
        }
        .slide-ai-conversation .aic-msg {
            max-width: 80%; padding: 0.7rem 1rem; border-radius: 14px;
            font-size: 0.95rem; line-height: 1.5; opacity: 0;
            animation: aicMsgIn 0.4s ease-out forwards;
        }
        .slide-ai-conversation .aic-msg.aic-user {
            align-self: flex-end; background: var(--accent, #f97316); color: #fff;
            border-bottom-right-radius: 4px;
        }
        .slide-ai-conversation .aic-msg.aic-ai {
            align-self: flex-start; background: rgba(255,255,255,0.1);
            color: var(--text, #f1f5f9); border-bottom-left-radius: 4px;
        }
        .slide-ai-conversation .aic-label {
            font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.08em; margin-bottom: 0.2rem; opacity: 0.6;
        }
        .slide-ai-conversation .aic-dots {
            display: inline-flex; gap: 4px; padding: 0.5rem 0;
        }
        .slide-ai-conversation .aic-dots span {
            width: 6px; height: 6px; border-radius: 50%; background: var(--text, #f1f5f9);
        }
        .slide-ai-conversation .aic-dots span:nth-child(1) { animation: aicDotPulse 1.2s infinite 0s; }
        .slide-ai-conversation .aic-dots span:nth-child(2) { animation: aicDotPulse 1.2s infinite 0.2s; }
        .slide-ai-conversation .aic-dots span:nth-child(3) { animation: aicDotPulse 1.2s infinite 0.4s; }

        /* ===== SPRINT 5: BEFORE-AFTER ===== */
        @keyframes baTypeChar {
            0% { width: 0; }
            100% { width: 100%; }
        }
        @keyframes baResultIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
        @keyframes baProcessDot {
            0%, 80%, 100% { opacity: 0.2; }
            40% { opacity: 1; }
        }
        .slide-before-after {
            display: flex; align-items: stretch; min-height: 70cqh; gap: 0;
        }
        .slide-before-after .ba-prompt-side, .slide-before-after .ba-result-side {
            flex: 1; display: flex; flex-direction: column; justify-content: center;
            padding: 3rem;
        }
        .slide-before-after .ba-prompt-side {
            background: rgba(255,255,255,0.03); border-right: 1px solid rgba(255,255,255,0.08);
        }
        .slide-before-after .ba-label {
            font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em;
            color: var(--accent, #f97316); margin-bottom: 0.75rem; font-weight: 600;
        }
        .slide-before-after .ba-prompt-text {
            font-family: 'SF Mono', 'Fira Code', monospace; font-size: 1rem;
            color: var(--text, #f1f5f9); line-height: 1.6;
            background: rgba(0,0,0,0.3); padding: 1.2rem; border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.08);
            overflow: hidden; white-space: pre-wrap;
        }
        .slide-before-after .ba-processing {
            display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;
            font-size: 0.85rem; color: var(--text, #f1f5f9); opacity: 0.6;
        }
        .slide-before-after .ba-processing .ba-dot {
            width: 5px; height: 5px; border-radius: 50%; background: var(--accent, #f97316);
        }
        .slide-before-after .ba-processing .ba-dot:nth-child(1) { animation: baProcessDot 1.4s infinite 0s; }
        .slide-before-after .ba-processing .ba-dot:nth-child(2) { animation: baProcessDot 1.4s infinite 0.2s; }
        .slide-before-after .ba-processing .ba-dot:nth-child(3) { animation: baProcessDot 1.4s infinite 0.4s; }
        .slide-before-after .ba-result-content {
            animation: baResultIn 0.8s ease-out 0.5s both;
        }
        .slide-before-after .ba-result-content img {
            max-width: 100%; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .slide-before-after .ba-result-text {
            font-size: 1.15rem; line-height: 1.7; color: var(--text, #f1f5f9);
        }
        .slide-before-after .ba-caption {
            font-size: 0.85rem; color: var(--text, #f1f5f9); opacity: 0.5; margin-top: 0.75rem;
        }

        /* ===== SPRINT 5: PROMPT REVEAL ===== */
        @keyframes prCursorBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
        .slide-prompt-reveal {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh;
        }
        .slide-prompt-reveal .pr-title {
            font-size: 1.2rem; font-weight: 600; color: var(--text, #f1f5f9);
            margin-bottom: 1rem; opacity: 0.7;
        }
        .slide-prompt-reveal .pr-window {
            width: 100%; max-width: 700px; background: rgba(0,0,0,0.4);
            border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
            overflow: hidden;
        }
        .slide-prompt-reveal .pr-toolbar {
            display: flex; align-items: center; gap: 6px; padding: 10px 14px;
            background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .slide-prompt-reveal .pr-dot {
            width: 10px; height: 10px; border-radius: 50%;
        }
        .slide-prompt-reveal .pr-dot:nth-child(1) { background: #ff5f57; }
        .slide-prompt-reveal .pr-dot:nth-child(2) { background: #febc2e; }
        .slide-prompt-reveal .pr-dot:nth-child(3) { background: #28c840; }
        .slide-prompt-reveal .pr-lang {
            margin-left: auto; font-size: 0.7rem; text-transform: uppercase;
            letter-spacing: 0.1em; color: var(--accent, #f97316); font-weight: 600;
        }
        .slide-prompt-reveal .pr-code {
            padding: 1.5rem; font-family: 'SF Mono', 'Fira Code', monospace;
            font-size: 0.95rem; line-height: 1.7; color: var(--text, #f1f5f9);
            white-space: pre-wrap;
        }
        .slide-prompt-reveal .pr-cursor {
            display: inline-block; width: 2px; height: 1.1em;
            background: var(--accent, #f97316); vertical-align: text-bottom;
            animation: prCursorBlink 0.8s infinite;
        }
        .slide-prompt-reveal .pr-caption {
            font-size: 0.9rem; color: var(--text, #f1f5f9); opacity: 0.5;
            margin-top: 1rem; text-align: center;
        }

        /* ===== SPRINT 5: PITFALL ===== */
        @keyframes pfShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
            20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        @keyframes pfStrikethrough {
            0% { width: 0; }
            100% { width: 100%; }
        }
        @keyframes pfCorrectionIn {
            0% { opacity: 0; transform: translateX(20px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        .slide-pitfall {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh;
        }
        .slide-pitfall .pf-badge {
            font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
            letter-spacing: 0.15em; padding: 0.3rem 1rem; border-radius: 20px;
            margin-bottom: 1.5rem;
        }
        .slide-pitfall .pf-badge.pf-warning { background: rgba(245,158,11,0.2); color: #f59e0b; }
        .slide-pitfall .pf-badge.pf-danger { background: rgba(239,68,68,0.2); color: #ef4444; }
        .slide-pitfall .pf-badge.pf-critical {
            background: rgba(239,68,68,0.3); color: #ef4444;
            animation: pfShake 0.6s ease-in-out;
        }
        .slide-pitfall .pf-qa {
            max-width: 650px; width: 100%;
        }
        .slide-pitfall .pf-question {
            font-size: 1.1rem; color: var(--text, #f1f5f9); padding: 1rem 1.2rem;
            background: rgba(255,255,255,0.06); border-radius: 12px;
            margin-bottom: 0.8rem;
        }
        .slide-pitfall .pf-answer {
            font-size: 1rem; color: var(--text, #f1f5f9); opacity: 0.8;
            padding: 1rem 1.2rem; background: rgba(255,255,255,0.03);
            border-radius: 12px; border-left: 3px solid rgba(255,255,255,0.15);
            position: relative; margin-bottom: 1rem;
        }
        .slide-pitfall .pf-answer .pf-strike {
            position: absolute; top: 50%; left: 0; height: 2px;
            background: #ef4444; animation: pfStrikethrough 0.8s ease-out 1.5s forwards;
        }
        .slide-pitfall .pf-correction {
            padding: 1rem 1.2rem; border-radius: 12px; border-left: 3px solid;
            animation: pfCorrectionIn 0.6s ease-out 2.5s both;
        }
        .slide-pitfall .pf-correction.pf-sev-warning {
            background: rgba(245,158,11,0.08); border-color: #f59e0b; color: #fbbf24;
        }
        .slide-pitfall .pf-correction.pf-sev-danger {
            background: rgba(239,68,68,0.08); border-color: #ef4444; color: #f87171;
        }
        .slide-pitfall .pf-correction.pf-sev-critical {
            background: rgba(239,68,68,0.12); border-color: #ef4444; color: #f87171;
            box-shadow: 0 0 20px rgba(239,68,68,0.2);
        }

        /* ===== SPRINT 6: STAT COMPARE ===== */
        @keyframes scArrowPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 8px rgba(249,115,22,0.4)); } 100% { transform: scale(1); } }
        @keyframes scArrowDraw {
            0% { stroke-dashoffset: 60; }
            100% { stroke-dashoffset: 0; }
        }
        .slide-stat-compare {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh; text-align: center;
        }
        .slide-stat-compare .sc-title {
            font-size: 1.3rem; font-weight: 600; color: var(--text, #f1f5f9);
            margin-bottom: 2rem; opacity: 0.7;
        }
        .slide-stat-compare .sc-row {
            display: flex; align-items: center; gap: 2rem;
        }
        .slide-stat-compare .sc-num {
            text-align: center;
        }
        .slide-stat-compare .sc-value {
            font-size: clamp(3rem, 8cqw, 6rem); font-weight: 800;
            line-height: 1;
        }
        .slide-stat-compare .sc-label {
            font-size: 0.9rem; color: var(--text, #f1f5f9); opacity: 0.5; margin-top: 0.3rem;
        }
        .slide-stat-compare .sc-arrow {
            width: 60px; height: 40px;
        }
        .slide-stat-compare .sc-arrow line, .slide-stat-compare .sc-arrow polyline {
            stroke: var(--accent, #f97316); stroke-width: 2; fill: none;
            stroke-dasharray: 60; stroke-dashoffset: 60;
            animation: scArrowDraw 1s ease-out 1s forwards;
        }
        .slide-stat-compare .sc-caption {
            font-size: 0.9rem; color: var(--text, #f1f5f9); opacity: 0.5; margin-top: 1.5rem;
        }

        /* ===== SPRINT 6: VOICE COLLAGE ===== */
        @keyframes vcCardIn {
            0% { opacity: 0; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1); }
        }
        .slide-voice-collage {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 2rem 3rem; min-height: 70cqh;
        }
        .slide-voice-collage .vc-title {
            font-size: 1.4rem; font-weight: 700; color: var(--text, #f1f5f9);
            margin-bottom: 1.5rem;
        }
        .slide-voice-collage .vc-grid {
            display: flex; flex-wrap: wrap; gap: 0.8rem; justify-content: center;
            max-width: 800px;
        }
        .slide-voice-collage .vc-card {
            padding: 1rem 1.3rem; background: rgba(255,255,255,0.06);
            border-radius: 12px; border-left: 3px solid var(--accent, #f97316);
            opacity: 0; animation: vcCardIn 0.4s ease-out forwards;
            max-width: 280px;
        }
        .slide-voice-collage .vc-card .vc-text {
            font-size: 0.95rem; color: var(--text, #f1f5f9); line-height: 1.5;
            font-style: italic;
        }
        .slide-voice-collage .vc-card .vc-author {
            font-size: 0.75rem; color: var(--accent, #f97316); margin-top: 0.4rem;
            font-weight: 600; font-style: normal;
        }

        /* ===== SPRINT 6: PORTRAIT QUOTE ===== */
        @keyframes pqFadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .slide-portrait-quote {
            display: flex; align-items: center; justify-content: center;
            padding: 4cqh 6cqw; min-height: 70cqh; gap: 6cqw;
        }
        .slide-portrait-quote .pq-image {
            width: clamp(100px, 22cqw, 220px); height: clamp(100px, 22cqw, 220px); border-radius: 50%; object-fit: cover;
            border: 0.4cqw solid var(--accent, #f97316); flex-shrink: 0;
            box-shadow: 0 0 3cqw rgba(0,0,0,0.3);
        }
        .slide-portrait-quote .pq-content { max-width: 60cqw; }
        .slide-portrait-quote .pq-mark {
            font-size: 8cqw; line-height: 1; color: var(--accent, #f97316); opacity: 0.2;
            font-family: Georgia, serif; margin-bottom: -2cqw;
        }
        .slide-portrait-quote .pq-text {
            font-size: clamp(0.9rem, 2.6cqmin, 1.6rem); line-height: 1.6; color: var(--text, #f1f5f9);
            font-style: italic; animation: pqFadeIn 0.6s ease-out;
        }
        .slide-portrait-quote .pq-attribution {
            margin-top: 2cqh; font-size: clamp(0.8rem, 2.2cqmin, 1.3rem); font-weight: 700;
            color: var(--text, #f1f5f9);
            animation: pqFadeIn 0.6s ease-out 0.3s both;
        }
        .slide-portrait-quote .pq-context {
            font-size: clamp(0.6rem, 1.6cqmin, 0.95rem); text-transform: uppercase; letter-spacing: 0.12em;
            color: var(--accent, #f97316); margin-top: 0.5cqh;
            animation: pqFadeIn 0.6s ease-out 0.4s both;
        }
        @keyframes pqSlideLeft {
            0% { opacity: 0; transform: translateX(-120px) perspective(800px) rotateY(8deg); }
            100% { opacity: 1; transform: translateX(0) perspective(800px) rotateY(0deg); }
        }
        .slide-portrait-quote.pq-slide-left {
            animation: pqSlideLeft 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* ===== SPRINT 6: REFLECTION ===== */
        @keyframes refQuestionIn {
            0% { opacity: 0; transform: translateX(-15px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        .slide-reflection {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh;
        }
        .slide-reflection .ref-tag {
            font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em;
            color: var(--accent, #f97316); margin-bottom: 0.5rem; font-weight: 600;
        }
        .slide-reflection .ref-title {
            font-size: clamp(1.5rem, 3cqw, 2.5rem); font-weight: 700;
            color: var(--text, #f1f5f9); margin-bottom: 0.5rem; text-align: center;
        }
        .slide-reflection .ref-duration {
            font-size: 0.85rem; color: var(--text, #f1f5f9); opacity: 0.5;
            margin-bottom: 2rem;
        }
        .slide-reflection .ref-questions {
            list-style: none; padding: 0; max-width: 550px; width: 100%;
        }
        .slide-reflection .ref-questions li {
            padding: 0.7rem 0; padding-left: 1.5rem; position: relative;
            font-size: 1.15rem; color: var(--text, #f1f5f9); line-height: 1.5;
            opacity: 0; animation: refQuestionIn 0.5s ease-out forwards;
            border-left: 2px solid rgba(255,255,255,0.08);
        }
        .slide-reflection .ref-questions li::before {
            content: ''; position: absolute; left: -5px; top: 1rem;
            width: 8px; height: 8px; border-radius: 50%;
            background: var(--accent, #f97316);
        }

        /* ===== SPRINT 7+8: COLLAGE ===== */
        @keyframes colImgIn {
            0% { opacity: 0; transform: scale(0.92); }
            100% { opacity: 1; transform: scale(1); }
        }
        .slide-collage {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 2rem 3rem; min-height: 70cqh;
        }
        .slide-collage .col-title {
            font-size: 1.3rem; font-weight: 700; color: var(--text, #f1f5f9);
            margin-bottom: 1rem;
        }
        .slide-collage .col-grid {
            display: grid; gap: 0.5rem; width: 100%; max-width: 900px;
        }
        .slide-collage .col-grid.col-2 { grid-template-columns: 1fr 1fr; }
        .slide-collage .col-grid.col-3 { grid-template-columns: 1fr 1fr 1fr; }
        .slide-collage .col-grid.col-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
        .slide-collage .col-img {
            width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 10px;
            opacity: 0; animation: colImgIn 0.5s ease-out forwards;
            cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
        }
        .slide-collage .col-img:hover { transform: scale(1.03); box-shadow: 0 4px 20px rgba(0,0,0,0.4); }

        /* ===== SPRINT 7+8: PROCESS CHAIN ===== */
        @keyframes pcNodeIn {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
        }
        .slide-process-chain {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 2rem 3rem; min-height: 70cqh;
        }
        .slide-process-chain .pc-title {
            font-size: 1.3rem; font-weight: 700; color: var(--text, #f1f5f9);
            margin-bottom: 1.5rem;
        }
        .slide-process-chain .pc-chain {
            display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
            justify-content: center;
        }
        .slide-process-chain .pc-node {
            padding: 0.8rem 1.2rem; background: rgba(255,255,255,0.06);
            border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
            text-align: center; opacity: 0; animation: pcNodeIn 0.4s ease-out forwards;
            min-width: 100px;
        }
        .slide-process-chain .pc-node.pc-active {
            border-color: var(--accent, #f97316);
            box-shadow: 0 0 15px rgba(249,115,22,0.2);
        }
        .slide-process-chain .pc-node-label {
            font-size: 0.95rem; font-weight: 700; color: var(--text, #f1f5f9);
        }
        .slide-process-chain .pc-node-hint {
            font-size: 0.75rem; color: var(--text, #f1f5f9); opacity: 0.5; margin-top: 0.2rem;
        }
        .slide-process-chain .pc-arrow {
            color: var(--accent, #f97316); font-size: 1.2rem; opacity: 0.5;
        }

        /* ===== SPRINT 7+8: ACRONYM LIST ===== */
        @keyframes alRowIn {
            0% { opacity: 0; transform: translateX(-10px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        .slide-acronym-list {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 3rem; min-height: 70cqh;
        }
        .slide-acronym-list .al-title {
            font-size: clamp(2rem, 5cqw, 3.5rem); font-weight: 800;
            color: var(--accent, #f97316); margin-bottom: 0.3rem;
        }
        .slide-acronym-list .al-tagline {
            font-size: 0.9rem; color: var(--text, #f1f5f9); opacity: 0.5;
            margin-bottom: 1.5rem;
        }
        .slide-acronym-list .al-rows { max-width: 600px; width: 100%; }
        .slide-acronym-list .al-row {
            display: flex; align-items: baseline; gap: 1rem;
            padding: 0.5rem 0; opacity: 0; animation: alRowIn 0.4s ease-out forwards;
        }
        .slide-acronym-list .al-letter {
            font-size: 2rem; font-weight: 900; color: var(--accent, #f97316);
            min-width: 2.5rem; text-align: center;
        }
        .slide-acronym-list .al-letter { transition: transform 0.2s, text-shadow 0.2s; cursor: default; }
        .slide-acronym-list .al-row:hover .al-letter { transform: scale(1.2); text-shadow: 0 0 15px rgba(249,115,22,0.4); }
        .slide-acronym-list .al-word {
            font-size: 1.1rem; font-weight: 700; color: var(--text, #f1f5f9);
        }
        .slide-acronym-list .al-desc {
            font-size: 0.9rem; color: var(--text, #f1f5f9); opacity: 0.6; font-style: italic;
        }

        /* ===== SPRINT 7+8 BONUS: MAP PINS ===== */
        @keyframes mpPinDrop {
            0% { opacity: 0; transform: translate(-50%, -150%); }
            60% { transform: translate(-50%, -90%); }
            80% { transform: translate(-50%, -105%); }
            100% { opacity: 1; transform: translate(-50%, -100%); }
        }
        .slide-map-pins {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 2rem; min-height: 70cqh;
        }
        .slide-map-pins .mp-title {
            font-size: 1.3rem; font-weight: 700; color: var(--text, #f1f5f9);
            margin-bottom: 1rem;
        }
        .slide-map-pins .mp-container {
            position: relative; display: inline-block; max-width: 800px; width: 100%;
        }
        .slide-map-pins .mp-container img {
            width: 100%; border-radius: 12px; display: block;
        }
        .slide-map-pins .mp-pin {
            position: absolute; width: 18px; height: 18px;
            background: var(--accent, #f97316); border-radius: 50%;
            border: 2px solid #fff; cursor: pointer;
            opacity: 0; animation: mpPinDrop 0.5s ease-out forwards;
            z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            transition: transform 0.2s;
        }
        .slide-map-pins .mp-pin:hover { transform: translate(-50%, -100%) scale(1.3); }
        .slide-map-pins .mp-pin::after {
            content: ''; position: absolute; top: -6px; left: -6px;
            width: 30px; height: 30px; border-radius: 50%;
            border: 2px solid var(--accent, #f97316); opacity: 0;
            animation: calloutPulse 2s infinite 1s;
        }
        .slide-map-pins .mp-tooltip {
            position: absolute; bottom: calc(100% + 10px); left: 50%;
            transform: translateX(-50%); background: rgba(0,0,0,0.9);
            color: #fff; padding: 0.5rem 0.8rem; border-radius: 10px;
            font-size: 0.8rem; white-space: nowrap; pointer-events: none;
            opacity: 0; transition: opacity 0.2s;
            border: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .slide-map-pins .mp-tooltip::after {
            content: ""; position: absolute; top: 100%; left: 50%;
            margin-left: -6px; border-width: 6px; border-style: solid;
            border-color: rgba(0,0,0,0.9) transparent transparent transparent;
        }
        .slide-map-pins .mp-pin:hover .mp-tooltip,
        .slide-map-pins .mp-pin.mp-open .mp-tooltip { opacity: 1; }

        /* ===== SPRINT 7+8 BONUS: MINDMAP ===== */
        @keyframes mmNodePop {
            0% { opacity: 0; transform: scale(0.7); }
            70% { transform: scale(1.05); }
            100% { opacity: 1; transform: scale(1); }
        }
        .slide-mindmap {
            display: flex; flex-direction: column; align-items: center;
            justify-content: center; padding: 2rem; min-height: 70cqh;
        }
        .slide-mindmap .mm-title {
            font-size: 1.3rem; font-weight: 700; color: var(--text, #f1f5f9);
            margin-bottom: 1rem;
        }
        .slide-mindmap .mm-canvas {
            position: relative; width: 100%; max-width: 850px;
            min-height: 400px;
        }
        .slide-mindmap .mm-node {
            position: absolute; padding: 0.6rem 1.2rem;
            background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
            border-radius: 12px; cursor: pointer;
            opacity: 0; animation: mmNodePop 0.4s ease-out forwards;
            transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
            z-index: 2;
        }
        .slide-mindmap .mm-node:hover {
            border-color: var(--accent, #f97316);
            box-shadow: 0 0 20px rgba(249,115,22,0.25);
            background: rgba(255,255,255,0.12);
        }
        @keyframes mmCenterPulse { 0% { box-shadow: 0 0 0 0 rgba(249,115,22,0.4); } 70% { box-shadow: 0 0 0 15px rgba(249,115,22,0); } 100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); } }
        .slide-mindmap .mm-node.mm-center {
            background: var(--accent, #f97316); color: #fff;
            border-color: var(--accent, #f97316); font-weight: 700;
            font-size: 1.1rem;
        }
            animation: mmCenterPulse 3s infinite;
        .slide-mindmap .mm-node-label {
            font-size: 0.9rem; font-weight: 600; color: var(--text, #f1f5f9);
        }
        .slide-mindmap .mm-node-detail {
            display: none; font-size: 0.8rem; color: var(--text, #f1f5f9);
            opacity: 0.7; margin-top: 0.3rem; max-width: 200px;
        }
        .slide-mindmap .mm-node.mm-expanded .mm-node-detail { display: block; }
        .slide-mindmap .mm-lines {
            position: absolute; inset: 0; z-index: 1;
        }
        .slide-mindmap .mm-lines line {
            stroke: rgba(255,255,255,0.12); stroke-width: 1;
        }

        /* ===== SPRINT 7+8 BONUS: MAP JOURNEY ===== */
        .slide-map-journey { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; }
        .slide-map-journey .mj-container { position: relative; width: 90%; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .slide-map-journey img { width: 100%; display: block; filter: brightness(0.8) contrast(1.2) grayscale(0.5); }
        .slide-map-journey .mj-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .slide-map-journey .mj-path { fill: none; stroke: var(--accent, #f97316); stroke-width: 3px; stroke-dasharray: 10 10; animation: mjDash 20s linear infinite; }
        @keyframes mjDash { to { stroke-dashoffset: -1000; } }
        .slide-map-journey .mj-pin { position: absolute; width: 20px; height: 20px; background: var(--accent); border-radius: 50%; border: 3px solid #fff; transform: translate(-50%, -50%); box-shadow: 0 0 15px var(--accent); z-index: 2; }
        .slide-map-journey .mj-label { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; background: rgba(0,0,0,0.8); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; white-space: nowrap; font-weight: 600; }

        /* ===== SPRINT 7+8 BONUS: MINDMAP TREE ===== */
        .slide-mindmap-tree { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .slide-mindmap-tree .mt-canvas { position: relative; width: 90%; height: 80%; }
        .slide-mindmap-tree .mt-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
        .slide-mindmap-tree .mt-node { position: absolute; padding: 0.8rem 1.2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: 600; font-size: 1rem; color: #fff; transform: translate(-50%, -50%); backdrop-filter: blur(10px); z-index: 2; transition: all 0.3s; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .slide-mindmap-tree .mt-node:hover { transform: translate(-50%, -50%) scale(1.05); background: rgba(255,255,255,0.1); }
        .slide-mindmap-tree .mt-root { background: rgba(249,115,22,0.2); border-color: var(--accent); font-size: 1.2rem; color: var(--accent); }
        .slide-mindmap-tree .mt-branch { background: rgba(34,211,238,0.15); border-color: #22d3ee; }
        .slide-mindmap-tree .mt-leaf { background: rgba(168,85,247,0.15); border-color: #a855f7; font-size: 0.9rem; font-weight: 400; }

        /* ===== SIGNATURE: LETTER MORPH (v2 — Scatter → Blink → Glow → Form → Scatter) ===== */
        .slide-letter-morph {
            position: relative; min-height: 70cqh; width: 100%;
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; cursor: pointer; user-select: none;
        }
        .slide-letter-morph .lm-letter {
            position: absolute; font-family: 'Inter', sans-serif;
            font-weight: 700; pointer-events: none;
            transition: all 1.4s cubic-bezier(0.23, 1, 0.32, 1);
            will-change: transform, opacity, left, top, font-size, color, text-shadow;
        }
        /* Scattered state — dim, random rotation */
        .slide-letter-morph .lm-letter.lm-scatter {
            color: rgba(255,255,255,0.12);
            text-shadow: none;
        }
        /* Blink state — quick orange flash */
        .slide-letter-morph .lm-letter.lm-blink {
            color: var(--accent, #f97316);
            opacity: 0.7 !important;
            text-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
            animation: lm-blink-pulse 0.4s ease-in-out;
        }
        @keyframes lm-blink-pulse {
            0% { opacity: 0.12; }
            50% { opacity: 0.9; }
            100% { opacity: 0.3; }
        }
        /* Glow state — pulsing orange, growing stronger */
        .slide-letter-morph .lm-letter.lm-glow {
            color: var(--accent, #f97316);
            text-shadow: 0 0 20px rgba(249, 115, 22, 0.9), 0 0 40px rgba(249, 115, 22, 0.4);
            animation: lm-glow-breathe 1.2s ease-in-out infinite;
        }
        @keyframes lm-glow-breathe {
            0%, 100% { text-shadow: 0 0 15px rgba(249, 115, 22, 0.6), 0 0 30px rgba(249, 115, 22, 0.2); }
            50% { text-shadow: 0 0 25px rgba(249, 115, 22, 1), 0 0 50px rgba(249, 115, 22, 0.5); }
        }
        /* Formed state — locked in place, accent color preserved */
        .slide-letter-morph .lm-letter.lm-formed {
            color: var(--accent, #f97316);
            text-shadow: 0 0 12px rgba(249, 115, 22, 0.4), 0 0 30px rgba(249, 115, 22, 0.15);
            opacity: 1 !important;
        }
        /* Unused frame letters — very faint */
        .slide-letter-morph .lm-letter.lm-frame {
            color: var(--accent, #f97316); opacity: 0.04;
        }
        .slide-letter-morph .lm-hint {
            position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
            font-size: 0.7rem; color: var(--text, #f1f5f9); opacity: 0.3;
            letter-spacing: 0.1em; text-transform: uppercase;
        }
        .slide-letter-morph .lm-counter {
            position: absolute; top: 1rem; right: 1.5rem;
            font-size: 0.7rem; color: var(--accent, #f97316); opacity: 0.5;
            font-family: 'JetBrains Mono', monospace;
        }

        /* ===== TOKEN SPINNER ===== */
        .slide-token-spinner {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 70cqh; padding: 2rem 5rem;
        }
        .ts-content {
            font-size: clamp(2rem, 4cqw, 3.5rem);
            font-weight: 300;
            line-height: 1.6;
            color: var(--text);
            max-width: 1200px;
            text-align: left;
        }
        .ts-spinner-wrapper {
            display: inline-flex;
            flex-direction: column;
            vertical-align: bottom;
            position: relative;
            margin: 0 0.1em;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 3px solid var(--accent, #f97316);
            border-radius: 4px 4px 0 0;
            transition: background 0.3s, border 0.3s;
        }
        .ts-spinner-mask {
            display: flex;
            flex-direction: column;
            height: 1.2em;
            overflow: hidden;
        }
        .ts-prob-badge {
            position: absolute;
            top: -1.4rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.8rem;
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            color: var(--accent, #f97316);
            opacity: 0;
            transition: opacity 0.2s, color 0.4s;
            text-shadow: 0 0 10px rgba(249, 115, 22, 0.6);
            pointer-events: none;
            z-index: 10;
        }
        .ts-spinner-wrapper.ts-spinning .ts-prob-badge { opacity: 1; }
        .ts-spinner-wrapper.ts-solidified .ts-prob-badge { opacity: 1; color: #10b981; text-shadow: 0 0 15px rgba(16, 185, 129, 0.8); }
        .ts-spinner-wrapper.ts-solidified {
            background: transparent;
            border-color: transparent;
        }
        .ts-spinner-wrapper.ts-solidified .ts-spinner-word {
            color: var(--accent, #f97316);
            font-weight: 700;
        }
        .ts-spinner-track {
            display: flex;
            flex-direction: column;
            transform: translateY(0);
        }
        .ts-spinner-word {
            height: 1.2em;
            line-height: 1.2em;
            padding: 0 0.2em;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,0.4);
        }

        /* ===== MAP-PROGRESSION ===== */
        .slide-map-progression { display: flex; width: 100%; height: 100%; position: relative; overflow: hidden; background: #000; color: #fff; text-align: left; }
        .mprog-map-area { flex: 1; position: relative; display: flex; justify-content: center; align-items: center; background: #050505; }
        
        /* The wrapper guarantees that the pins' percentage coordinates always exactly match the map image, regardless of screen shape */
        .mprog-map-wrapper { position: relative; width: 100%; max-width: 100%; max-height: 100%; aspect-ratio: 16/9; display: flex; justify-content: center; align-items: center; }
        .mprog-map-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; filter: contrast(1.1); }
        
        .mprog-sidebar { width: clamp(260px, 22cqw, 360px); background: rgba(10,10,15,0.95); border-left: 1px solid rgba(255,255,255,0.1); padding: clamp(1.5rem, 2cqw, 2.5rem) clamp(1rem, 1.5cqw, 1.5rem); display: flex; flex-direction: column; z-index: 10; box-shadow: -15px 0 40px rgba(0,0,0,0.6); }
        .mprog-title { font-size: clamp(1.8rem, 2cqw, 2.2rem); font-weight: 300; margin-bottom: 2rem; color: var(--accent); line-height: 1.2; letter-spacing: -0.02em; }
        .mprog-list { display: flex; flex-direction: column; gap: 0.8rem; overflow-y: auto; padding-right: 0.5rem; }
        .mprog-item { padding: 1rem 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; cursor: pointer; transition: all 0.3s cubic-bezier(0.2,0.8,0.2,1); opacity: 0; transform: translateX(30px); display: none; }
        .mprog-item.revealed { opacity: 1; transform: translateX(0); display: block; }
        .mprog-item:hover, .mprog-item.active { background: rgba(255,255,255,0.08); border-color: var(--accent); transform: scale(1.02); }
        .mprog-item-title { font-weight: 600; font-size: clamp(1.2rem, 1.6cqw, 1.6rem); margin-bottom: 0.4rem; color: #fff; }
        .mprog-item-subtitle { font-size: clamp(0.8rem, 1cqw, 1rem); color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 1.5px; }
        
        .mprog-pin { position: absolute; width: clamp(20px, 2cqw, 28px); height: clamp(20px, 2cqw, 28px); background: #fff; border-radius: 50%; transform: translate(-50%, -50%) scale(0); transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; z-index: 5; box-shadow: 0 0 20px rgba(255,255,255,0.8); display: none; }
        .mprog-pin.revealed { transform: translate(-50%, -50%) scale(1); display: block; }
        .mprog-pin.active { background: #ef4444; box-shadow: 0 0 30px rgba(239,68,68,0.8); z-index: 6; }
        .mprog-pin.active::after { content: ''; position: absolute; top: -16px; left: -16px; right: -16px; bottom: -16px; border-radius: 50%; border: 3px solid #ef4444; animation: mprog-pulse 2s cubic-bezier(0.2,0.8,0.2,1) infinite; }
        @keyframes mprog-pulse { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.8); opacity: 0; } }
        
        .mprog-infobox { position: absolute; width: clamp(400px, 45cqw, 650px); background: rgba(15, 15, 20, 0.9); border: 1px solid rgba(255,255,255,0.1); border-top: 4px solid var(--accent); border-radius: 16px; padding: clamp(1.5rem, 3cqw, 3rem); z-index: 20; opacity: 0; pointer-events: none; transition: all 0.4s cubic-bezier(0.2,0.8,0.2,1); backdrop-filter: blur(15px); box-shadow: 0 25px 60px rgba(0,0,0,0.7); transform: translateY(30px); }
        .mprog-infobox.show { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .mprog-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: #fff; font-size: 2.5rem; cursor: pointer; opacity: 0.4; transition: opacity 0.2s; padding: 0; line-height: 1; }
        .mprog-close:hover { opacity: 1; }
        .mprog-info-title { font-size: clamp(2.2rem, 3.5cqw, 3.5rem); font-weight: 300; margin-bottom: 0.8rem; color: #fff; letter-spacing: -0.02em; }
        .mprog-info-meta { font-size: clamp(0.9rem, 1.2cqw, 1.2rem); color: var(--accent); margin-bottom: clamp(1rem, 2cqw, 2rem); text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
        .mprog-info-desc { font-size: clamp(1.1rem, 1.6cqw, 1.6rem); line-height: 1.6; color: rgba(255,255,255,0.9); font-weight: 300; }
        
        .mprog-svg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 15; }
        .mprog-svg-overlay line { transition: opacity 0.3s ease; stroke-linecap: round; }

        /* ===== WARNING PULSE ===== */
        @keyframes warnPulse {
            0% { transform: scale(0.95); text-shadow: 0 0 20px rgba(239, 68, 68, 0.4); opacity: 0.8; }
            50% { transform: scale(1.05); text-shadow: 0 0 100px rgba(239, 68, 68, 1); opacity: 1; }
            100% { transform: scale(0.95); text-shadow: 0 0 20px rgba(239, 68, 68, 0.4); opacity: 0.8; }
        }
        @keyframes warnDrop {
            0% { transform: translateY(-50px) scale(1.5); opacity: 0; }
            100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes warnSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .slide-warning-pulse {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            min-height: 70cqh; text-align: center;
        }
        .slide-warning-pulse .wp-mark-spinner {
            animation: warnSpin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 5s forwards;
            margin-bottom: 0rem;
        }
        .slide-warning-pulse .wp-mark {
            font-size: clamp(8rem, 25cqw, 20rem);
            font-weight: 900;
            color: #ef4444;
            line-height: 1;
            animation: warnDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, warnPulse 2s ease-in-out infinite 0.6s;
        }
        .slide-warning-pulse .wp-title {
            font-size: clamp(2rem, 5cqw, 3.5rem);
            font-weight: 700;
            color: var(--text, #f1f5f9);
            opacity: 0;
            animation: gtWordFade 0.6s ease forwards 0.4s;
        }
        .slide-warning-pulse .wp-subtitle {
            font-size: clamp(1rem, 2cqw, 1.5rem);
            color: rgba(255,255,255,0.7);
            margin-top: 1rem;
            opacity: 0;
            animation: gtWordFade 0.6s ease forwards 0.6s;
            max-width: 800px;
        }
    `;
    document.head.appendChild(style);

    // ===== REGISTER SLIDE TYPES =====

    /**
     * word-cascade: Words that drop into place
     * JSON: { type: "word-cascade", words: ["Every","student","deserves","to","be","*seen*"], speed: 200, finalPause: true }
     */
    function renderWordCascade(s) {
        const speed = s.speed || 200;
        const words = (s.words || []).map((w, i) => {
            const isEmphasis = w.startsWith('*') && w.endsWith('*');
            const cleanWord = isEmphasis ? w.slice(1, -1) : w;
            const isLast = i === (s.words || []).length - 1;
            const animName = (isEmphasis || (s.finalPause && isLast)) ? 'wordLand' : 'wordDrop';
            const cls = isEmphasis ? 'wc-word wc-emphasis' : 'wc-word';
            return `<span class="${cls}" style="animation: ${animName} 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * speed}ms forwards">${cleanWord}</span>`;
        }).join('');

        return `<div class="slide-word-cascade">${words}</div>`;
    }

    /**
     * box-reveal: Boxes that bounce in with glassmorphism borders
     * JSON: { type: "box-reveal", title: "...",
     *         boxes: [{ title: "...", text: "...", icon: "optional emoji", iconSrc: "optional/path.png" }, ...] }
     */
    function renderBoxReveal(s) {
        const boxes = (s.boxes || []).map((box, i) => {
            let iconHTML = '';
            if (box.iconSrc) {
                iconHTML = `<img class="br-icon-img" src="${box.iconSrc}" alt="${box.title || ''}">`;
            } else if (box.icon) {
                iconHTML = `<span class="br-icon">${box.icon}</span>`;
            }
            return `
            <div class="br-box" style="animation: boxBounce 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) ${300 + i * 250}ms forwards">
                ${iconHTML}
                <div class="br-title">${box.title || ''}</div>
                <div class="br-text">${box.text || ''}</div>
            </div>
        `;
        }).join('');

        return `
            <div class="slide-box-reveal">
                <h2>${s.title || ''}</h2>
                <div class="br-grid">${boxes}</div>
            </div>
        `;
    }

    /**
     * bullet-build: Progressive bullet point reveals
     * JSON: { type: "bullet-build", title: "...", items: ["Point 1", "*Emphasis point*", "Point with|subtitle"], auto: true, interval: 800 }
     */
    function renderBulletBuild(s) {
        const interval = s.interval || 600;
        const items = (s.items || []).map((item, i) => {
            const isEmphasis = item.startsWith('*') && item.endsWith('*');
            let text = isEmphasis ? item.slice(1, -1) : item;
            let subtitle = '';
            
            // Support "Main text|Subtitle" format
            if (text.includes('|')) {
                const parts = text.split('|');
                text = parts[0];
                subtitle = parts[1];
            }
            
            const cls = isEmphasis ? 'bb-item bb-emphasis' : 'bb-item';
            const delay = 400 + i * interval;
            
            return `
                <li class="${cls}" style="animation: bulletSlide 0.5s ease ${delay}ms forwards">
                    <span class="bb-dot" style="animation: dotPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay - 100}ms forwards"></span>
                    <span>
                        ${text}
                        ${subtitle ? `<span class="bb-subtitle">${subtitle}</span>` : ''}
                    </span>
                </li>
            `;
        }).join('');

        return `
            <div class="slide-bullet-build">
                <h2>${s.title || ''}</h2>
                <ul class="bb-list">${items}</ul>
            </div>
        `;
    }

    // ===== SPRINT 2: LINE CHART =====

    /**
     * line-chart: SVG lines drawn with stroke-dashoffset animation
     * JSON: { type: "line-chart", title: "...", xLabel: "...", yLabel: "...",
     *         labels: ["2020","2021",...],
     *         series: [{ name: "...", color: "#6366f1", points: [12,18,25,34,56] }] }
     */
    function renderLineChart(s) {
        const id = 'lc-' + Math.random().toString(36).slice(2, 8);
        const W = 800, H = 400;
        const pad = { top: 30, right: 100, bottom: 50, left: 55 };
        const chartW = W - pad.left - pad.right;
        const chartH = H - pad.top - pad.bottom;
        const labels = s.labels || [];
        const series = s.series || [];

        let isTimeAxis = false;
        let timeMin = 0, timeMax = 1;
        
        let allPts = [];
        series.forEach(sr => {
            if (!sr.points) return;
            sr.normPoints = sr.points.map((p, i) => {
                if (typeof p === 'number') return { index: i, y: p };
                if (p.x && typeof p.x === 'string' && p.x.includes('-')) {
                    isTimeAxis = true;
                    return { ...p, time: new Date(p.x).getTime() };
                }
                return { index: i, ...p };
            });
            allPts.push(...sr.normPoints);
        });

        let yMin = Math.min(0, ...allPts.map(p => p.y));
        let yMax = Math.max(...allPts.map(p => p.y)) * 1.15;
        
        if (isTimeAxis) {
            timeMin = Math.min(...allPts.map(p => p.time));
            timeMax = Math.max(...allPts.map(p => p.time));
            if (timeMin === timeMax) timeMax = timeMin + 1;
            const padTime = (timeMax - timeMin) * 0.05;
            timeMin -= padTime;
            timeMax += padTime;
        }

        const xScale = (p) => {
            if (isTimeAxis) {
                return pad.left + ((p.time - timeMin) / (timeMax - timeMin)) * chartW;
            }
            return pad.left + (p.index / Math.max(1, labels.length - 1)) * chartW;
        };
        const yScale = (v) => pad.top + chartH - ((v - yMin) / (yMax - yMin)) * chartH;

        let gridLines = '';
        for (let i = 0; i <= 4; i++) {
            const yVal = yMin + (i / 4) * (yMax - yMin);
            const y = yScale(yVal);
            gridLines += `<line class="lc-grid-line" x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}"/>`;
            gridLines += `<text class="lc-axis-label" x="${pad.left - 8}" y="${y + 4}" text-anchor="end">${Math.round(yVal)}</text>`;
        }

        let xLabels = '';
        if (isTimeAxis) {
            const numLabels = labels.length > 0 ? labels.length : 5;
            for(let i=0; i<numLabels; i++) {
                const t = timeMin + (i / Math.max(1, numLabels - 1)) * (timeMax - timeMin);
                const d = new Date(t);
                const l = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
                const x = pad.left + (i / Math.max(1, numLabels - 1)) * chartW;
                xLabels += `<text class="lc-axis-label" x="${x}" y="${H - pad.bottom + 25}" text-anchor="middle">${l}</text>`;
            }
        } else {
            xLabels = labels.map((l, i) =>
                `<text class="lc-axis-label" x="${xScale({index:i})}" y="${H - pad.bottom + 25}" text-anchor="middle">${l}</text>`
            ).join('');
        }

        let yAxisLabel = s.yLabel ? `<text class="lc-axis-label" x="15" y="${pad.top + chartH/2}" text-anchor="middle" transform="rotate(-90,15,${pad.top + chartH/2})">${s.yLabel}</text>` : '';
        let xAxisLabel = s.xLabel ? `<text class="lc-axis-label" x="${pad.left + chartW/2}" y="${H - 5}" text-anchor="middle">${s.xLabel}</text>` : '';

        let linesHTML = '';
        let dotsHTML = '';
        series.forEach((sr, si) => {
            const delay = 0.5 + si * 0.8;
            
            if (s.pauseIndex && s.pauseIndex > 0 && s.pauseIndex < sr.normPoints.length) {
                const pts1 = sr.normPoints.slice(0, s.pauseIndex);
                const pts2 = sr.normPoints.slice(s.pauseIndex - 1);
                
                const ptsHTML1 = pts1.map(p => `${xScale(p)},${yScale(p.y)}`).join(' ');
                let pathLen1 = 0;
                for (let i = 1; i < pts1.length; i++) pathLen1 += Math.hypot(xScale(pts1[i]) - xScale(pts1[i-1]), yScale(pts1[i].y) - yScale(pts1[i-1].y));
                
                const ptsHTML2 = pts2.map(p => `${xScale(p)},${yScale(p.y)}`).join(' ');
                let pathLen2 = 0;
                for (let i = 1; i < pts2.length; i++) pathLen2 += Math.hypot(xScale(pts2[i]) - xScale(pts2[i-1]), yScale(pts2[i].y) - yScale(pts2[i-1].y));
                
                linesHTML += `<polyline class="lc-data-line" points="${ptsHTML1}" stroke="${sr.color || '#6366f1'}" 
                    style="stroke-dasharray:${pathLen1};stroke-dashoffset:${pathLen1};animation:drawLine 2s ease ${delay}s forwards"/>`;
                linesHTML += `<polyline class="lc-data-line lc-paused-stage" points="${ptsHTML2}" stroke="${sr.color || '#6366f1'}" 
                    style="stroke-dasharray:${pathLen2};stroke-dashoffset:${pathLen2};animation:drawLine 2s ease ${delay}s forwards"/>`;
            } else {
                const ptsHTML = (sr.normPoints || []).map(p => `${xScale(p)},${yScale(p.y)}`).join(' ');
                let pathLen = 0;
                for (let i = 1; i < sr.normPoints.length; i++) pathLen += Math.hypot(xScale(sr.normPoints[i]) - xScale(sr.normPoints[i-1]), yScale(sr.normPoints[i].y) - yScale(sr.normPoints[i-1].y));
                linesHTML += `<polyline class="lc-data-line" points="${ptsHTML}" stroke="${sr.color || '#6366f1'}" 
                    style="stroke-dasharray:${pathLen};stroke-dashoffset:${pathLen};animation:drawLine 2s ease ${delay}s forwards"/>`;
            }

            (sr.normPoints || []).forEach((p, i) => {
                const isPaused = (s.pauseIndex && i >= s.pauseIndex) ? ' lc-paused-stage' : '';
                const dotDelay = delay + 0.3 + i * 0.15;
                const labelAttr = p.label ? `data-label="${p.label}"` : '';
                const infoAttr = p.info ? `data-info="${p.info}"` : '';
                const valAttr = `data-val="${p.y}"`;
                dotsHTML += `<circle class="lc-dot${isPaused}" cx="${xScale(p)}" cy="${yScale(p.y)}" r="0" fill="${sr.color || '#6366f1'}" 
                    ${labelAttr} ${infoAttr} ${valAttr}
                    style="animation:dotAppear 0.4s ease ${dotDelay}s forwards; pointer-events:all;"/>`;
                
                if (p.label) {
                    const labelDelay = dotDelay + 0.2;
                    const lx = xScale(p);
                    const ly = yScale(p.y);
                    const above = (i % 2 === 0);
                    const labelX = lx + 8;
                    const labelY = above ? ly - 12 : ly + 18;
                    dotsHTML += `<text class="lc-point-label${isPaused}" x="${labelX}" y="${labelY}" text-anchor="start" style="animation-delay:${labelDelay}s">${p.label}</text>`;
                }
            });
        });

        const legend = series.map(sr =>
            `<div class="lc-legend-item"><div class="lc-legend-dot" style="background:${sr.color}"></div>${sr.name || ''}</div>`
        ).join('');

        setTimeout(() => {
            const chartEl = document.getElementById(id);
            if (!chartEl) return;
            const tooltip = document.createElement('div');
            tooltip.className = 'lc-tooltip';
            chartEl.querySelector('.lc-chart').appendChild(tooltip);
            
            const dots = chartEl.querySelectorAll('.lc-dot');
            dots.forEach(dot => {
                dot.addEventListener('mouseenter', (e) => {
                    const label = dot.dataset.label;
                    const info = dot.dataset.info;
                    const val = dot.dataset.val;
                    if (!label && !info) return;
                    
                    tooltip.innerHTML = (label ? '<div class="lc-tooltip-title">' + label + '</div>' : '') +
                                      (info ? '<div style="white-space:normal; max-width:320px; line-height:1.5; font-size:1.15rem;">' + info + '</div>' : '') +
                                      '<div style="margin-top:0.5rem; opacity:0.8; font-family:monospace; font-size:1.2rem; color:var(--accent, #f97316);">' + val + ' minuter</div>';
                    
                    const rect = chartEl.querySelector('.lc-chart').getBoundingClientRect();
                    const dotRect = dot.getBoundingClientRect();
                    
                    const top = dotRect.top - rect.top;
                    const left = dotRect.left - rect.left + (dotRect.width/2);
                    
                    // Prevent tooltip from overflowing the top of the chart container
                    if (top < 120) {
                        tooltip.style.transform = 'translate(-50%, 0) translateY(18px)';
                    } else {
                        tooltip.style.transform = 'translate(-50%, -100%) translateY(-18px)';
                    }
                    
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
                    tooltip.classList.add('visible');
                });
                dot.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
                
                // Allow click as fallback for mobile/touch
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    tooltip.classList.toggle('visible');
                });
            });
        }, 100);

        let introOverlayHTML = '';
        let pausedClass = '';
        if (s.intro) {
            pausedClass = ' lc-paused';
            introOverlayHTML = `
                <div class="lc-intro-overlay">
                    <h3 style="font-size: clamp(1.8rem, 4cqw, 3rem); margin-bottom: 1.5rem; color: var(--accent, #f97316); text-align: center;">${s.intro.title}</h3>
                    <p style="font-size: clamp(1.1rem, 2cqw, 1.8rem); max-width: 85%; text-align: center; color: var(--text); margin-bottom: 2.5rem; line-height: 1.5;">${s.intro.text}</p>
                    <button class="lc-intro-btn" onclick="this.parentElement.style.opacity='0'; this.parentElement.style.pointerEvents='none'; document.getElementById('${id}').classList.remove('lc-paused');" style="padding: clamp(0.6rem, 1.5cqw, 1rem) clamp(1.5rem, 3cqw, 2.5rem); font-size: clamp(1rem, 1.8cqw, 1.5rem); font-weight: bold; background: var(--accent, #f97316); color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(249,115,22,0.4);">${s.intro.button || 'Visa graf'}</button>
                </div>
            `;
        }
        
        let morphBtnHTML = '';
        if (s.morph) {
            morphBtnHTML = `
                <button class="lc-morph-btn" onclick="
                    this.style.opacity = '0';
                    this.style.pointerEvents = 'none';
                    const chart = document.getElementById('${id}').querySelector('svg');
                    chart.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.2s ease-in';
                    chart.style.transformOrigin = 'bottom';
                    chart.style.transform = 'scaleY(${s.morph.scale || 0.2})';
                    chart.style.opacity = '0';
                    setTimeout(() => {
                        if(window.nextSlide) window.nextSlide();
                    }, 1100);
                " style="position: absolute; bottom: clamp(1rem, 3cqw, 2rem); right: clamp(1rem, 3cqw, 2rem); padding: clamp(0.5rem, 1cqw, 0.8rem) clamp(1rem, 2cqw, 1.5rem); font-size: clamp(0.9rem, 1.5cqw, 1.2rem); font-weight: bold; background: var(--accent, #f97316); color: white; border: none; border-radius: 6px; cursor: pointer; z-index: 10; box-shadow: 0 4px 15px rgba(249,115,22,0.3); transition: transform 0.2s;">
                    ${s.morph.button || 'Gå vidare →'}
                </button>
            `;
        }
        
        let revealStageBtnHTML = '';
        if (s.pauseIndex) {
            revealStageBtnHTML = `
                <button class="lc-reveal-btn" onclick="
                    this.style.opacity = '0';
                    this.style.pointerEvents = 'none';
                    document.querySelectorAll('#${id} .lc-paused-stage').forEach(el => {
                        el.classList.add('lc-reveal-stage');
                        el.classList.remove('lc-paused-stage');
                    });
                " style="position: absolute; bottom: clamp(1rem, 3cqw, 2rem); right: clamp(1rem, 3cqw, 2rem); padding: clamp(0.5rem, 1cqw, 0.8rem) clamp(1rem, 2cqw, 1.5rem); font-size: clamp(0.9rem, 1.5cqw, 1.2rem); font-weight: bold; background: var(--accent, #f97316); color: white; border: none; border-radius: 6px; cursor: pointer; z-index: 10; box-shadow: 0 4px 15px rgba(249,115,22,0.3); transition: transform 0.2s;">
                    Visa 2026 →
                </button>
            `;
        }

        return `
            <div class="slide-line-chart${pausedClass}" id="${id}">
                ${introOverlayHTML}
                ${morphBtnHTML}
                ${revealStageBtnHTML}
                <h2>${s.title || ''}</h2>
                <div class="lc-chart">
                    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="overflow: visible;">
                        ${gridLines}
                        ${xLabels}
                        ${yAxisLabel}
                        ${xAxisLabel}
                        ${linesHTML}
                        ${dotsHTML}
                    </svg>
                </div>
                <div class="lc-legend">${legend}</div>
            </div>
        `;
    }

    // ===== SPRINT 2: COMPARISON =====

    /**
     * comparison: Side-by-side columns sliding in from opposite edges
     * JSON: { type: "comparison", title: "...",
     *         left: { label: "Utan", items: ["40 min/elev", ...] },
     *         right: { label: "Med", items: ["8 min/elev", ...] },
     *         highlights: [0, 1] }
     */
    function renderComparison(s) {
        const left = s.left || { label: '', items: [] };
        const right = s.right || { label: '', items: [] };
        const highlights = new Set(s.highlights || []);

        const renderItems = (items, side) => items.map((item, i) => {
            const hl = highlights.has(i) ? ' cmp-highlight' : '';
            const delay = (side === 'left' ? 0.6 : 0.8) + i * 0.15;
            return `<div class="cmp-item${hl}" style="opacity:0;animation:${side === 'left' ? 'slideFromLeft' : 'slideFromRight'} 0.5s ease ${delay}s forwards">${item}</div>`;
        }).join('');

        return `
            <div class="slide-comparison">
                <h2>${s.title || ''}</h2>
                <div class="cmp-grid">
                    <div class="cmp-col cmp-left">
                        <div class="cmp-label">${left.label || ''}</div>
                        ${renderItems(left.items || [], 'left')}
                    </div>
                    <div class="cmp-divider"></div>
                    <div class="cmp-col cmp-right">
                        <div class="cmp-label">${right.label || ''}</div>
                        ${renderItems(right.items || [], 'right')}
                    </div>
                </div>
            </div>
        `;
    }

    // ===== SPRINT 2: TIMELINE VERTICAL =====

    /**
     * timeline-vertical: Line drawn downward with nodes popping in
     * JSON: { type: "timeline-vertical", title: "...",
     *         nodes: [{ year: "2022", text: "...", sub: "optional detail" }, ...] }
     */
    function renderTimelineVertical(s) {
        const nodes = (s.nodes || []).map((node, i) => {
            const nodeDelay = 0.5 + i * 0.5;
            const dotDelay = nodeDelay - 0.1;
            return `
                <div class="tv-node" style="animation:bulletSlide 0.5s ease ${nodeDelay}s forwards">
                    <div class="tv-dot" style="animation:nodePopIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${dotDelay}s forwards"></div>
                    <div class="tv-year">${node.year || ''}</div>
                    <div class="tv-text">${node.text || ''}</div>
                    ${node.sub ? `<div class="tv-sub">${node.sub}</div>` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="slide-timeline-v">
                <h2>${s.title || ''}</h2>
                <div class="tv-track">
                    <div class="tv-line"></div>
                    ${nodes}
                </div>
            </div>
        `;
    }

    // ===== SPRINT 3: PROGRESS RING =====

    /**
     * progress-ring: Circular SVG gauge with countUp
     * JSON: { type: "progress-ring", title: "...", value: 78, max: 100, unit: "%",
     *         color: "#22c55e", subtitle: "Biologi, VT 2026" }
     */
    function renderProgressRing(s) {
        const val = s.value || 0;
        const max = s.max || 100;
        const pct = val / max;
        const R = 120, CX = 140, CY = 140;
        const C = 2 * Math.PI * R;
        const target = C * (1 - pct);
        const color = s.color || 'var(--accent, #f97316)';
        const uid = 'pr-' + Math.random().toString(36).slice(2, 8);

        // CountUp via inline script triggered after render
        setTimeout(() => {
            const el = document.getElementById(uid);
            if (!el) return;
            const duration = 2000;
            const start = performance.now();
            function tick(now) {
                const t = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
                el.textContent = Math.round(eased * val);
                if (t < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }, 500);

        return `
            <div class="slide-progress-ring">
                <h2>${s.title || ''}</h2>
                <div class="pr-wrap">
                    <svg width="280" height="280" viewBox="0 0 280 280">
                        <circle class="pr-bg" cx="${CX}" cy="${CY}" r="${R}"/>
                        <circle class="pr-fg" cx="${CX}" cy="${CY}" r="${R}"
                            stroke="${color}"
                            stroke-dasharray="${C}"
                            stroke-dashoffset="${C}"
                            style="--ring-target:${target};animation:ringFill 2s ease 0.4s forwards"/>
                    </svg>
                    <div class="pr-center">
                        <div class="pr-value"><span id="${uid}">0</span><span class="pr-unit">${s.unit || ''}</span></div>
                    </div>
                </div>
                ${s.subtitle ? `<div class="pr-subtitle">${s.subtitle}</div>` : ''}
            </div>
        `;
    }

    // ===== SPRINT 3: NUMBER WALL =====

    /**
     * number-wall: Grid of animated counters
     * JSON: { type: "number-wall", title: "...",
     *         numbers: [{ value: 268, label: "Slides", icon: "📊" }, ...] }
     */
    function renderNumberWall(s) {
        const id = 'nw-container-' + Math.random().toString(36).slice(2, 8);
        const nums = s.numbers || [];
        const cells = nums.map((n, i) => {
            const uid = 'nw-' + Math.random().toString(36).slice(2, 8);
            const delay = 300 + i * 200;

            // Schedule countUp
            setTimeout(() => {
                function startCounter() {
                    const el = document.getElementById(uid);
                    if (!el) return;
                    const target = n.value || 0;
                    const duration = 1800;
                    const start = performance.now();
                    function tick(now) {
                        const t = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - t, 4);
                        el.textContent = Math.round(eased * target);
                        if (t < 1) requestAnimationFrame(tick);
                    }
                    requestAnimationFrame(tick);
                }
                function checkUnpause() {
                    const el = document.getElementById(uid);
                    if (!el) return;
                    if (el.closest('.nw-paused')) {
                        setTimeout(checkUnpause, 100);
                    } else {
                        setTimeout(startCounter, delay + 400);
                    }
                }
                checkUnpause();
            }, 50);

            let iconHTML = '';
            if (n.iconSrc) {
                iconHTML = `<img class="nw-icon-img" src="${n.iconSrc}" alt="${n.label || ''}">`;
            } else if (n.icon) {
                iconHTML = `<span class="nw-icon">${n.icon}</span>`;
            }

            return `
                <div class="nw-cell" style="animation:boxBounce 0.6s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms forwards">
                    ${iconHTML}
                    <div class="nw-value" id="${uid}">0</div>
                    <div class="nw-label">${n.label || ''}</div>
                </div>
            `;
        }).join('');

        let introOverlayHTML = '';
        let pausedClass = '';
        if (s.intro) {
            pausedClass = ' nw-paused';
            introOverlayHTML = `
                <div class="lc-intro-overlay">
                    <h3 style="font-size: clamp(1.8rem, 4cqw, 3rem); margin-bottom: 1.5rem; color: var(--accent, #f97316); text-align: center;">${s.intro.title || s.title}</h3>
                    <p style="font-size: clamp(1.1rem, 2cqw, 1.8rem); max-width: 85%; text-align: center; color: var(--text); margin-bottom: 2.5rem; line-height: 1.5;">${s.intro.text}</p>
                    <button class="lc-intro-btn" onclick="this.parentElement.style.opacity='0'; this.parentElement.style.pointerEvents='none'; document.getElementById('${id}').classList.remove('nw-paused');" style="padding: clamp(0.6rem, 1.5cqw, 1rem) clamp(1.5rem, 3cqw, 2.5rem); font-size: clamp(1rem, 1.8cqw, 1.5rem); font-weight: bold; background: var(--accent, #f97316); color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 15px rgba(249,115,22,0.4);">${s.intro.button || 'Visa data'}</button>
                </div>
            `;
        }

        return `
            <div class="slide-number-wall${pausedClass}" id="${id}">
                ${introOverlayHTML}
                <h2>${s.title || ''}</h2>
                <div class="nw-grid">${cells}</div>
                ${renderSourcesPopup(s.sources)}
            </div>
        `;
    }

    // ===== SPRINT 3: BAR RACE =====

    /**
     * bar-race: Horizontal animated bars sorted by value
     * JSON: { type: "bar-race", title: "...", unit: "%",
     *         items: [{ label: "ChatGPT", value: 78, color: "#6366f1" }, ...] }
     */
    function renderBarRace(s) {
        const items = [...(s.items || [])].sort((a, b) => (b.value || 0) - (a.value || 0));
        const maxVal = items.length ? items[0].value : 1;
        const unit = s.unit || '';

        const rows = items.map((item, i) => {
            const pct = ((item.value || 0) / maxVal) * 100;
            const delay = 400 + i * 200;
            const isLeader = i === 0;
            const leaderClass = isLeader ? ' brc-leader' : '';
            const pulseAnim = isLeader ? ';animation-name:barPulse;animation-duration:3s;animation-delay:2.5s;animation-iteration-count:infinite' : '';

            return `
                <div class="brc-row${leaderClass}" style="animation:bulletSlide 0.5s ease ${delay}ms forwards">
                    <div class="brc-label">${item.label || ''}</div>
                    <div class="brc-track">
                        <div class="brc-bar" style="width:${pct}%;background:${item.color || 'var(--accent)'};animation:barGrow 1.2s ease ${delay + 100}ms both${pulseAnim}"></div>
                    </div>
                    <div class="brc-val">${item.value}${unit}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="slide-bar-race">
                <h2>${s.title || ''}</h2>
                ${rows}
            </div>
        `;
    }

    // ===== SPRINT 4 RENDERERS =====

    /**
     * giant-text — One big statement. **bold** = accent.
     * Props: text, align ("left"|"center"), variant ("display"|"serif"),
     *        entrance ("fade"|"word-by-word"|"instant"), decoration (string)
     */
    function renderGiantText(s) {
        const align = s.align === 'center' ? 'gt-center' : '';
        const variant = s.variant === 'serif' ? 'gt-serif' : '';
        const entrance = s.entrance || 'word-by-word';
        const deco = s.decoration ? `<div class="gt-decoration">${s.decoration}</div>` : '';

        // Parse **bold** markers
        const rawText = s.text || '';
        const parts = rawText.split(/(\*\*[^*]+\*\*)/g);

        let wordIndex = 0;
        const htmlParts = parts.map(part => {
            const isBold = part.startsWith('**') && part.endsWith('**');
            const clean = isBold ? part.slice(2, -2) : part;
            const words = clean.split(/\s+/).filter(w => w);
            return words.map(w => {
                const delay = entrance === 'word-by-word' ? `animation-delay: ${wordIndex++ * 0.12}s` : '';
                const cls = isBold ? 'gt-word gt-bold' : 'gt-word';
                const style = entrance === 'instant' ? 'opacity:1' : delay;
                return `<span class="${cls}" style="${style}">${w} </span>`;
            }).join('');
        }).join('');

        return `
            <div class="slide-giant-text ${align} ${variant}">
                ${deco}
                <div class="gt-text">${htmlParts}</div>
            </div>
        `;
    }

    /**
     * callout — Prominent box with variant color.
     * Props: variant ("insight"|"info"|"warning"|"success"|"danger"|"quote"),
     *        title, tag, body, items[], pulsate (bool)
     */
    function renderCallout(s) {
        const colorMap = {
            insight: 'var(--accent, #06b6d4)',
            info: 'var(--accent, #06b6d4)',
            quote: 'var(--accent, #06b6d4)',
            warning: '#f59e0b',
            success: '#10b981',
            danger: '#ef4444'
        };
        const tagMap = {
            insight: 'NYCKELINSIKT', info: 'INFO', warning: 'VARNING',
            success: 'FRAMGÅNG', danger: 'VARNING', quote: 'CITAT'
        };
        const variant = s.variant || 'insight';
        const color = colorMap[variant] || colorMap.insight;
        const tag = s.tag || tagMap[variant] || '';
        const pulsate = (s.pulsate || variant === 'warning' || variant === 'danger') ? 'co-pulsate' : '';

        let itemsHtml = '';
        if (s.items && s.items.length) {
            itemsHtml = `<ul class="co-items">${s.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        }

        return `
            <div class="slide-callout">
                <div class="co-box ${pulsate}" style="--co-color: ${color}">
                    ${tag ? `<div class="co-tag">${tag}</div>` : ''}
                    ${s.title ? `<div class="co-title">${s.title}</div>` : ''}
                    ${s.body ? `<div class="co-body">${s.body}</div>` : ''}
                    ${itemsHtml}
                </div>
            </div>
        `;
    }

    /**
     * section-divider — Section break with number + title.
     * Props: number, title, subtitle, duration, variant ("centered"|"hero"|"left"),
     *        progress { current, total }
     */
    function renderSectionDivider(s) {
        const variant = s.variant === 'hero' ? 'sd-hero' : '';
        const number = s.number || '';
        let progressHtml = '';
        if (s.progress) {
            const pct = Math.round((s.progress.current / s.progress.total) * 100);
            progressHtml = `
                <div class="sd-progress">
                    <div class="sd-progress-fill" style="width: ${pct}%"></div>
                </div>
            `;
        }

        return `
            <div class="slide-section-divider ${variant}">
                ${number ? `<div class="sd-number">${number}</div>` : ''}
                <div class="sd-title">${s.title || ''}</div>
                ${s.subtitle ? `<div class="sd-subtitle">${s.subtitle}</div>` : ''}
                ${s.duration ? `<div class="sd-duration">${s.duration}</div>` : ''}
                ${progressHtml}
            </div>
        `;
    }

    /**
     * hero-image — Full-bleed image with text overlay.
     * Props: src, title, subtitle, gradient ("bottom"|"top"|"left"|"radial"|"none"),
     *        textPosition ("bl"|"bc"|"br"|"tl"|"tc"|"tr"|"cl"|"cc"|"cr"),
     *        overlay (0-1), kenBurns (bool)
     */
    function renderHeroImage(s) {
        const gradient = s.gradient || 'bottom';
        const pos = s.textPosition || 'bl';
        const overlay = s.overlay != null ? s.overlay : 0.35;
        const kb = s.kenBurns ? 'hi-kenburns' : '';
        const gradClass = gradient !== 'none' ? `hi-grad-${gradient}` : '';

        return `
            <div class="slide-hero-image">
                <div class="hi-bg ${kb}" style="background-image: url('${s.src || ''}');
                    filter: brightness(${1 - overlay});"></div>
                ${gradClass ? `<div class="hi-gradient ${gradClass}"></div>` : ''}
                <div class="hi-content hi-pos-${pos}">
                    ${s.title ? `<div class="hi-title">${s.title}</div>` : ''}
                    ${s.subtitle ? `<div class="hi-subtitle">${s.subtitle}</div>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * outro — Closing slide with title, contacts, QR code(s), CTA.
     * Props: title, subtitle, contacts[] (strings), qrUrl, qrCaption,
     *        secondaryQrUrl, secondaryQrCaption, cta, nextSteps[]
     */
    function renderOutro(s) {
        const title = s.title || 'Tack!';
        const qrSize = 150;
        const qrApi = (url) => `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000`;

        let contactsHtml = '';
        if (s.contacts && s.contacts.length) {
            contactsHtml = `<div class="ou-contacts">${s.contacts.map(c => `<span class="ou-contact">${c}</span>`).join('')}</div>`;
        }

        let qrHtml = '';
        if (s.qrUrl) {
            qrHtml += `<div class="ou-qr-block"><img src="${qrApi(s.qrUrl)}" alt="QR"><div class="ou-qr-caption">${s.qrCaption || s.qrUrl}</div></div>`;
        }
        if (s.secondaryQrUrl) {
            qrHtml += `<div class="ou-qr-block"><img src="${qrApi(s.secondaryQrUrl)}" alt="QR"><div class="ou-qr-caption">${s.secondaryQrCaption || s.secondaryQrUrl}</div></div>`;
        }

        let nextStepsHtml = '';
        if (s.nextSteps && s.nextSteps.length) {
            nextStepsHtml = `<ul class="ou-next-steps">${s.nextSteps.map(n => `<li>${n}</li>`).join('')}</ul>`;
        }

        return `
            <div class="slide-outro">
                <div class="ou-title">${title}</div>
                ${s.subtitle ? `<div class="ou-subtitle">${s.subtitle}</div>` : ''}
                ${contactsHtml}
                ${qrHtml ? `<div class="ou-qr-section">${qrHtml}</div>` : ''}
                ${nextStepsHtml}
                ${s.cta ? `<div class="ou-cta">${s.cta}</div>` : ''}
            </div>
        `;
    }

    // ===== SPRINT 5 RENDERERS =====

    /**
     * ai-conversation — Simulated AI chat with typing indicator.
     * Props: title, messages[] ({ role: "user"|"ai", label?, text }),
     *        userLabel, aiLabel, highlightPattern (regex string)
     */
    function renderAiConversation(s) {
        const userLabel = s.userLabel || 'Du';
        const aiLabel = s.aiLabel || 'AI';
        const highlight = s.highlightPattern ? new RegExp(`(${s.highlightPattern})`, 'gi') : null;
        const msgs = s.messages || [];

        let msgHtml = '';
        msgs.forEach((m, i) => {
            const isUser = (m.role || '').toLowerCase() === 'user';
            const cls = isUser ? 'aic-user' : 'aic-ai';
            const label = m.label || (isUser ? userLabel : aiLabel);
            const baseDelay = i * 1.2;
            let text = m.text || '';
            if (highlight && !isUser) {
                text = text.replace(highlight, '<strong style="color:var(--accent,#f97316)">$1</strong>');
            }

            // Typing dots before AI messages
            if (!isUser && i > 0) {
                const dotsDelay = baseDelay - 0.6;
                msgHtml += `<div class="aic-msg aic-ai" style="animation-delay:${dotsDelay}s; padding: 0.5rem 1rem;">
                    <div class="aic-dots"><span></span><span></span><span></span></div>
                </div>`;
            }

            msgHtml += `<div class="aic-msg ${cls}" style="animation-delay:${baseDelay}s">
                <div class="aic-label">${label}</div>
                ${text}
            </div>`;
        });

        return `
            <div class="slide-ai-conversation">
                ${s.title ? `<div class="aic-title">${s.title}</div>` : ''}
                <div class="aic-chat">${msgHtml}</div>
            </div>
        `;
    }

    /**
     * before-after — Prompt typed → result revealed.
     * Props: promptText, resultType ("image"|"text"|"code"),
     *        resultContent (text or image URL), caption, comparison (bool)
     */
    function renderBeforeAfter(s) {
        const resultType = s.resultType || 'text';
        let resultHtml = '';
        if (resultType === 'image') {
            resultHtml = `<img src="${s.resultContent || ''}" alt="Result">`;
        } else if (resultType === 'code') {
            resultHtml = `<pre style="font-family:'SF Mono',monospace;font-size:0.9rem;color:var(--text,#f1f5f9);line-height:1.6;white-space:pre-wrap;">${s.resultContent || ''}</pre>`;
        } else {
            resultHtml = `<div class="ba-result-text">${s.resultContent || ''}</div>`;
        }

        return `
            <div class="slide-before-after">
                <div class="ba-prompt-side">
                    <div class="ba-label">Prompt</div>
                    <div class="ba-prompt-text">${s.promptText || ''}</div>
                    <div class="ba-processing">
                        <span class="ba-dot"></span><span class="ba-dot"></span><span class="ba-dot"></span>
                        <span style="margin-left:0.3rem">Genererar...</span>
                    </div>
                </div>
                <div class="ba-result-side">
                    <div class="ba-label">Resultat</div>
                    <div class="ba-result-content">
                        ${resultHtml}
                    </div>
                    ${s.caption ? `<div class="ba-caption">${s.caption}</div>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * prompt-reveal — Code/prompt in a terminal-like window.
     * Props: code, language, title, caption, mode ("typewriter"|"instant"|"input")
     */
    function renderPromptReveal(s) {
        const mode = s.mode || 'instant';
        const lang = s.language || 'prompt';
        const code = s.code || '';

        // Typewriter effect: show text char-by-char via CSS clip
        const codeHtml = mode === 'typewriter'
            ? `<span class="pr-typed">${code}</span><span class="pr-cursor"></span>`
            : code;

        return `
            <div class="slide-prompt-reveal">
                ${s.title ? `<div class="pr-title">${s.title}</div>` : ''}
                <div class="pr-window">
                    <div class="pr-toolbar">
                        <div class="pr-dot"></div><div class="pr-dot"></div><div class="pr-dot"></div>
                        <span class="pr-lang">${lang}</span>
                    </div>
                    <div class="pr-code">${codeHtml}</div>
                </div>
                ${s.caption ? `<div class="pr-caption">${s.caption}</div>` : ''}
            </div>
        `;
    }

    /**
     * pitfall — AI failure visualization.
     * Props: badge, severity ("warning"|"danger"|"critical"),
     *        question, answer, correction
     */
    function renderPitfall(s) {
        const sev = s.severity || 'danger';
        const badge = s.badge || (sev === 'critical' ? 'HALLUCINATION' : 'AI-FÄLLA');

        return `
            <div class="slide-pitfall${sev === 'critical' ? ' pf-shake-container' : ''}">
                <div class="pf-badge pf-${sev}">${badge}</div>
                <div class="pf-qa">
                    ${s.question ? `<div class="pf-question">❓ ${s.question}</div>` : ''}
                    ${s.answer ? `<div class="pf-answer">${s.answer}<div class="pf-strike"></div></div>` : ''}
                    ${s.correction ? `<div class="pf-correction pf-sev-${sev}">✓ ${s.correction}</div>` : ''}
                </div>
            </div>
        `;
    }

    // ===== SPRINT 6 RENDERERS =====

    /**
     * stat-compare — Two numbers with animated arrow.
     * Props: title, from, fromLabel, fromSuffix, to, toLabel, toSuffix, caption
     */
    function renderStatCompare(s) {
        const from = s.from != null ? s.from : 0;
        const to = s.to != null ? s.to : 0;
        const fromColor = to > from ? 'rgba(255,255,255,0.5)' : '#ef4444';
        const toColor = to > from ? '#10b981' : '#ef4444';

        return `
            <div class="slide-stat-compare">
                ${s.title ? `<div class="sc-title">${s.title}</div>` : ''}
                <div class="sc-row">
                    <div class="sc-num">
                        <div class="sc-value" style="color:${fromColor}">${s.fromPrefix||''}${from}${s.fromSuffix||''}</div>
                        ${s.fromLabel ? `<div class="sc-label">${s.fromLabel}</div>` : ''}
                    </div>
                    <svg class="sc-arrow" viewBox="0 0 60 40">
                        <line x1="5" y1="20" x2="45" y2="20"/>
                        <polyline points="38,12 48,20 38,28"/>
                    </svg>
                    <div class="sc-num">
                        <div class="sc-value" style="color:${toColor}">${s.toPrefix||''}${to}${s.toSuffix||''}</div>
                        ${s.toLabel ? `<div class="sc-label">${s.toLabel}</div>` : ''}
                    </div>
                </div>
                ${s.caption ? `<div class="sc-caption">${s.caption}</div>` : ''}
            </div>
        `;
    }

    /**
     * voice-collage — Grid of short quotes.
     * Props: title, voices[] ({ text, author }), highlightIndex
     */
    function renderVoiceCollage(s) {
        const voices = s.voices || [];
        const rotations = [-2, 1.5, -1, 2, -1.5, 0.8, -0.5, 1.8];
        const cards = voices.map((v, i) => {
            const rot = rotations[i % rotations.length];
            const delay = i * 0.12;
            const highlight = i === s.highlightIndex ? 'border-color: var(--accent, #f97316); box-shadow: 0 0 15px rgba(249,115,22,0.2);' : '';
            const fontSize = (v.text || '').length < 40 ? '1.15rem' : '0.95rem';
            return `<div class="vc-card" style="animation-delay:${delay}s; transform:rotate(${rot}deg); ${highlight}">
                <div class="vc-text" style="font-size:${fontSize}">${v.text || ''}</div>
                ${v.author ? `<div class="vc-author">— ${v.author}</div>` : ''}
            </div>`;
        }).join('');

        return `
            <div class="slide-voice-collage">
                ${s.title ? `<div class="vc-title">${s.title}</div>` : ''}
                <div class="vc-grid">${cards}</div>
            </div>
        `;
    }

    /**
     * portrait-quote — Quote with portrait image.
     * Props: image, attribution, context, text, imagePosition ("left"|"right")
     */
    function renderPortraitQuote(s) {
        const pos = s.imagePosition === 'right' ? 'row-reverse' : 'row';
        const animClass = s.animation === 'slide-left' ? ' pq-slide-left' : '';
        return `
            <div class="slide-portrait-quote${animClass}" style="flex-direction:${pos}">
                ${s.image ? `<img class="pq-image" src="${s.image}" alt="${s.attribution || ''}">` : ''}
                <div class="pq-content">
                    <div class="pq-mark">“</div>
                    <div class="pq-text">${s.text || ''}</div>
                    ${s.attribution ? `<div class="pq-attribution">${s.attribution}</div>` : ''}
                    ${s.context ? `<div class="pq-context">${s.context}</div>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * reflection — Sequential questions for audience.
     * Props: title, tag, duration, questions[], mode ("pair"|"group"|"individual")
     */
    function renderReflection(s) {
        const questions = s.questions || [];
        const tag = s.tag || 'REFLEKTION';
        const modeIcons = { pair: '👥', group: '👫👫', individual: '🧑' };
        const modeIcon = modeIcons[s.mode] || '';

        const qs = questions.map((q, i) => {
            const delay = i * 0.4;
            return `<li style="animation-delay:${delay}s">${q}</li>`;
        }).join('');

        return `
            <div class="slide-reflection">
                <div class="ref-tag">${tag} ${modeIcon}</div>
                ${s.title ? `<div class="ref-title">${s.title}</div>` : ''}
                ${s.duration ? `<div class="ref-duration">${s.duration}</div>` : ''}
                <ul class="ref-questions">${qs}</ul>
            </div>
        `;
    }

    // ===== SPRINT 7+8+BONUS RENDERERS =====

    /**
     * collage — Image grid.
     * Props: title, images[] (URLs), layout ("grid-2"|"grid-3"|"grid-4")
     */
    function renderCollage(s) {
        const images = s.images || [];
        const cols = s.layout === 'grid-2' ? 'col-2' : s.layout === 'grid-4' ? 'col-4' : 'col-3';
        const imgs = images.map((url, i) =>
            `<img class="col-img" src="${url}" alt="" style="animation-delay:${i * 0.15}s">`
        ).join('');
        return `
            <div class="slide-collage">
                ${s.title ? `<div class="col-title">${s.title}</div>` : ''}
                <div class="col-grid ${cols}">${imgs}</div>
            </div>
        `;
    }

    /**
     * process-chain — Node chain with arrows.
     * Props: title, nodes[] ({ label, hint, status: "done"|"active"|"upcoming" })
     */
    function renderProcessChain(s) {
        const nodes = s.nodes || [];
        const html = nodes.map((n, i) => {
            const cls = n.status === 'active' ? 'pc-active' : '';
            const delay = i * 0.2;
            const arrow = i < nodes.length - 1 ? '<span class="pc-arrow">→</span>' : '';
            return `<div class="pc-node ${cls}" style="animation-delay:${delay}s">
                <div class="pc-node-label">${n.label || ''}</div>
                ${n.hint ? `<div class="pc-node-hint">${n.hint}</div>` : ''}
            </div>${arrow}`;
        }).join('');
        return `
            <div class="slide-process-chain">
                ${s.title ? `<div class="pc-title">${s.title}</div>` : ''}
                <div class="pc-chain">${html}</div>
            </div>
        `;
    }

    /**
     * acronym-list — SAMR, Bloom etc.
     * Props: title, tagline, items[] ({ letter, word, description })
     */
    function renderAcronymList(s) {
        const items = s.items || [];
        const rows = items.map((item, i) => {
            const delay = i * 0.15;
            return `<div class="al-row" style="animation-delay:${delay}s">
                ${item.letter ? `<div class="al-letter">${item.letter}</div>` : ''}
                <div>
                    <span class="al-word">${item.word || ''}</span>
                    ${item.description ? `<span class="al-desc"> — ${item.description}</span>` : ''}
                </div>
            </div>`;
        }).join('');
        return `
            <div class="slide-acronym-list">
                ${s.title ? `<div class="al-title">${s.title}</div>` : ''}
                ${s.tagline ? `<div class="al-tagline">${s.tagline}</div>` : ''}
                <div class="al-rows">${rows}</div>
            </div>
        `;
    }

    /**
     * map-pins — Image with positioned pins, click-to-show info panels.
     * Props: title, mapImage, pins[] ({ label, x, y, note })
     */
    function renderMapPins(s) {
        const pins = s.pins || [];
        const pinHtml = pins.map((p, i) => {
            const delay = i * 0.2;
            return `<div class="mp-pin" style="left:${p.x}%; top:${p.y}%; animation-delay:${delay}s"
                onclick="this.classList.toggle('mp-open')">
                <div class="mp-tooltip">${p.label || ''}${p.note ? ` — ${p.note}` : ''}</div>
                <div class="mp-pulse"></div>
            </div>`;
        }).join('');
        return `
            <div class="slide-map-pins">
                ${s.title ? `<div class="mp-title">${s.title}</div>` : ''}
                <div class="mp-container">
                    <img src="${s.mapImage || ''}" alt="Map">
                    ${pinHtml}
                </div>
            </div>
        `;
    }

    /**
     * map-progression — Drops pins sequentially via nextStep, shows info box avoiding the pin.
     * Props: title, mapImage, labs[] ({ id, name, location, x, y, desc, meta })
     */
    function renderMapProgression(s) {
        const id = 'mprog_' + Math.random().toString(36).slice(2, 8);
        const labs = s.labs || [];
        
        const sidebarHtml = labs.map((l, i) => `
            <div class="mprog-item" id="${id}-item-${i}" onclick="window.${id}_activate(${i})">
                <div class="mprog-item-title">${l.name || ''}</div>
            <div class="mprog-item-subtitle">${l.location || ''}</div>
            </div>
        `).join('');

        const pinsHtml = labs.map((l, i) => `
            <div class="mprog-pin" id="${id}-pin-${i}" style="left:${l.x}%; top:${l.y}%;" onclick="window.${id}_activate(${i})"></div>
        `).join('');

        // Provide logic via setTimeout
        setTimeout(() => {
            let step = 0;
            let activeIdx = -1;
            let lineReqFrame;
            const infoBox = document.getElementById(`${id}-infobox`);
            if(!infoBox) return; // Prevent errors if DOM missing
            
            function updateLine() {
                if (activeIdx < 0) return;
                const pin = document.getElementById(`${id}-pin-${activeIdx}`);
                const wrapper = document.getElementById(`${id}-wrapper`);
                const line = document.getElementById(`${id}-line`);
                if (!pin || !infoBox || !wrapper || !line) return;
                
                const wRect = wrapper.getBoundingClientRect();
                const pRect = pin.getBoundingClientRect();
                const bRect = infoBox.getBoundingClientRect();
                
                if (wRect.width === 0 || bRect.width === 0) {
                    lineReqFrame = requestAnimationFrame(updateLine);
                    return;
                }
                
                const pinX = pRect.left + pRect.width/2 - wRect.left;
                const pinY = pRect.top + pRect.height/2 - wRect.top;
                const boxY = bRect.top + bRect.height/2 - wRect.top;
                
                let boxX;
                const lab = labs[activeIdx];
                if (lab.x < 50) {
                    // Box is on the right, connect to its left edge
                    boxX = bRect.left - wRect.left - 5;
                } else {
                    // Box is on the left, connect to its right edge
                    boxX = bRect.right - wRect.left + 5;
                }
                
                line.setAttribute('x1', boxX);
                line.setAttribute('y1', boxY);
                line.setAttribute('x2', pinX);
                line.setAttribute('y2', pinY);
                
                lineReqFrame = requestAnimationFrame(updateLine);
            }
            
            window[`${id}_activate`] = (idx) => {
                // You can only click items that have been revealed (idx < step)
                if(idx >= step) return;
                // Deactivate old
                if(activeIdx >= 0) {
                    const oldItem = document.getElementById(`${id}-item-${activeIdx}`);
                    const oldPin = document.getElementById(`${id}-pin-${activeIdx}`);
                    if(oldItem) oldItem.classList.remove('active');
                    if(oldPin) oldPin.classList.remove('active');
                }
                activeIdx = idx;
                const lab = labs[idx];
                const item = document.getElementById(`${id}-item-${idx}`);
                const pin = document.getElementById(`${id}-pin-${idx}`);
                if(item) item.classList.add('active');
                if(pin) pin.classList.add('active');
                
                // Populate info
                document.getElementById(`${id}-info-title`).innerHTML = lab.name || '';
                document.getElementById(`${id}-info-meta`).innerHTML = lab.meta || lab.location || '';
                document.getElementById(`${id}-info-desc`).innerHTML = lab.desc || '';
                
                // Position info box dynamically relative to pin (avoid overlap and ensure line visibility)
                let clampedY = Math.max(15, Math.min(lab.y, 85)); // Keep it vertically inside the wrapper
                if(lab.x < 50) {
                    infoBox.style.left = Math.min(lab.x + 8, 55) + '%';
                    infoBox.style.right = 'auto';
                } else {
                    infoBox.style.right = Math.min(100 - lab.x + 8, 55) + '%';
                    infoBox.style.left = 'auto';
                }
                infoBox.style.top = clampedY + '%';
                infoBox.style.transform = 'translateY(-50%)';
                
                infoBox.classList.add('show');
                infoBox.classList.remove('hide');
                
                if (lineReqFrame) cancelAnimationFrame(lineReqFrame);
                document.getElementById(`${id}-line`).setAttribute('opacity', '0.6');
                updateLine();
            };

            window[`${id}_close`] = (e) => {
                if(e) e.stopPropagation();
                infoBox.classList.remove('show');
                infoBox.classList.add('hide');
                if (lineReqFrame) cancelAnimationFrame(lineReqFrame);
                document.getElementById(`${id}-line`).setAttribute('opacity', '0');
                if(activeIdx >= 0) {
                    const activePin = document.getElementById(`${id}-pin-${activeIdx}`);
                    const activeItem = document.getElementById(`${id}-item-${activeIdx}`);
                    if(activePin) activePin.classList.remove('active');
                    if(activeItem) activeItem.classList.remove('active');
                    activeIdx = -1;
                }
            };

            window.handleNextStep = () => {
                if (step < labs.length) {
                    // Reveal next
                    const stepItem = document.getElementById(`${id}-item-${step}`);
                    const stepPin = document.getElementById(`${id}-pin-${step}`);
                    if(stepItem) stepItem.classList.add('revealed');
                    if(stepPin) stepPin.classList.add('revealed');
                    
                    // Increment step first so activate allows it
                    const currentStep = step;
                    step++;
                    
                    // Activate it automatically
                    window[`${id}_activate`](currentStep);
                    return true;
                }
                return false; // Let it proceed to next slide
            };
        }, 50);

        return `
            <div class="slide-map-progression">
                <div class="mprog-map-area">
                    <div class="mprog-map-wrapper" id="${id}-wrapper">
                        <img class="mprog-map-img" src="${s.mapImage || ''}" alt="Map">
                        <svg class="mprog-svg-overlay">
                            <line id="${id}-line" x1="0" y1="0" x2="0" y2="0" stroke="var(--accent, #f97316)" stroke-width="2" stroke-dasharray="4,6" opacity="0" />
                        </svg>
                        ${pinsHtml}
                        <div class="mprog-infobox" id="${id}-infobox">
                            <button class="mprog-close" onclick="window.${id}_close(event)">×</button>
                            <div class="mprog-info-title" id="${id}-info-title"></div>
                            <div class="mprog-info-meta" id="${id}-info-meta"></div>
                            <div class="mprog-info-desc" id="${id}-info-desc"></div>
                        </div>
                    </div>
                </div>
                <div class="mprog-sidebar">
                    <div class="mprog-title">${s.title || ''}</div>
                    <div class="mprog-list">
                        ${sidebarHtml}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * mindmap — Interactive concept map with auto-positioned nodes and curved SVG connections.
     * Props: title, center (string), nodes[] ({ label, detail, children[]? })
     * Auto-calculates radial positions. Click to expand detail.
     */
    function renderMindmap(s) {
        const nodes = s.nodes || [];
        const id = 'mm-' + Math.random().toString(36).slice(2, 8);

        // Auto-calculate positions if not provided
        const positioned = nodes.map((n, i) => {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const rx = 35, ry = 35;
            return {
                ...n,
                x: n.x != null ? n.x : 50 + Math.cos(angle) * rx,
                y: n.y != null ? n.y : 50 + Math.sin(angle) * ry
            };
        });

        // SVG curved paths from center to each node
        const cx = 50, cy = 50;
        const paths = positioned.map((n, i) => {
            const mx = (cx + n.x) / 2;
            const my = (cy + n.y) / 2;
            // Add slight curve
            const offset = (i % 2 === 0 ? 5 : -5);
            const cpx = mx + offset;
            const cpy = my + offset;
            return `<path d="M ${cx} ${cy} Q ${cpx} ${cpy} ${n.x} ${n.y}"
                fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.4"
                stroke-dasharray="1 0.5" />`;
        }).join('');

        // Node elements with color coding
        const colors = ['#f97316', '#a855f7', '#22d3ee', '#10b981', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'];
        const nodeHtml = positioned.map((n, i) => {
            const delay = (i + 1) * 0.12;
            const color = colors[i % colors.length];
            return `<div class="mm-node" style="left:${n.x}%; top:${n.y}%; transform:translate(-50%,-50%); animation-delay:${delay}s; border-color:${color}"
                onclick="this.classList.toggle('mm-expanded')">
                <div class="mm-node-label" style="color:${color}">${n.label || ''}</div>
                ${n.detail ? `<div class="mm-node-detail">${n.detail}</div>` : ''}
            </div>`;
        }).join('');

        return `
            <div class="slide-mindmap" id="${id}">
                ${s.title ? `<div class="mm-title">${s.title}</div>` : ''}
                <div class="mm-canvas">
                    <svg class="mm-lines" viewBox="0 0 100 100" preserveAspectRatio="none">${paths}</svg>
                    <div class="mm-node mm-center" style="left:${cx}%; top:${cy}%; transform:translate(-50%,-50%); opacity:1">
                        <div class="mm-node-label">${s.center || 'Tema'}</div>
                    </div>
                    ${nodeHtml}
                </div>
            </div>
        `;
    }

    /**
     * letter-morph v2 — Scatter → Blink → Glow → Form → Scatter-back.
     * Props: phrases[] (array of strings)
     * Click to cycle through phrases. Letters start scattered, needed ones
     * blink orange, glow increasingly, form the sentence, then scatter back.
     */
    function renderLetterMorph(s) {
        const id = 'lm-' + Math.random().toString(36).slice(2, 8);
        const phrases = s.phrases || ['Hej världen'];
        const totalLetters = 120;

        setTimeout(() => {
            const el = document.getElementById(id);
            if (!el) return;
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ';
            let phraseIdx = 0;
            let letters = [];
            let seed = 42;
            let isAnimating = false;

            function rng() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

            // Generate a random scatter position for a letter
            function scatterPos(i) {
                const angle = (i / totalLetters) * Math.PI * 2 + (rng() - 0.5) * 2;
                return {
                    x: (rng() * 88 + 6) + '%',
                    y: (rng() * 82 + 8) + '%',
                    rot: Math.round((rng() - 0.5) * 70),
                    size: (12 + rng() * 18) + 'px'
                };
            }

            // Phase 0: Create all letters in scattered state
            function createLetters() {
                letters.forEach(l => l.el && l.el.remove());
                letters = [];
                seed = 42;
                for (let i = 0; i < totalLetters; i++) {
                    const span = document.createElement('span');
                    span.className = 'lm-letter lm-scatter';
                    span.textContent = alphabet[Math.floor(rng() * alphabet.length)];
                    const pos = scatterPos(i);
                    span.style.fontSize = pos.size;
                    span.style.left = pos.x;
                    span.style.top = pos.y;
                    span.style.opacity = (0.06 + rng() * 0.08).toFixed(2);
                    span.style.transform = 'translate(-50%, -50%) rotate(' + pos.rot + 'deg)';
                    el.appendChild(span);
                    letters.push({ el: span, scatterPos: pos });
                }
            }

            // Measure target positions for a phrase
            function measurePhrase(phrase) {
                const layout = document.createElement('div');
                layout.style.cssText = 'position:absolute;inset:0;display:flex;flex-wrap:wrap;justify-content:center;align-items:center;align-content:center;padding:10%;gap:1.5rem;visibility:hidden;';
                const charsCount = phrase.replace(/\s+/g, '').length;
                const fontClamp = charsCount > 30 ? 'clamp(1.8rem, 5vmin, 4rem)' : 'clamp(2.2rem, 7vmin, 5.5rem)';
                layout.style.fontSize = fontClamp;
                layout.style.fontWeight = '700';
                layout.style.textAlign = 'center';

                const words = phrase.toUpperCase().split(' ');
                const targets = [];
                words.forEach(word => {
                    const wordDiv = document.createElement('div');
                    wordDiv.style.display = 'flex';
                    word.split('').forEach(char => {
                        const span = document.createElement('span');
                        span.textContent = char;
                        wordDiv.appendChild(span);
                        targets.push({ char, span });
                    });
                    layout.appendChild(wordDiv);
                });
                el.appendChild(layout);

                const coords = targets.map(t => {
                    let x = t.span.offsetLeft, y = t.span.offsetTop;
                    let p = t.span.offsetParent;
                    while (p && p !== el) { x += p.offsetLeft; y += p.offsetTop; p = p.offsetParent; }
                    return { char: t.char, x: x + t.span.offsetWidth / 2, y: y + t.span.offsetHeight / 2, fontClamp };
                });
                el.removeChild(layout);
                return coords;
            }

            // Full animation cycle for a phrase
            async function animatePhrase(phrase) {
                isAnimating = true;
                const targets = measurePhrase(phrase);
                document.getElementById(`${id}-counter`).textContent = (phraseIdx + 1) + ' / ' + phrases.length;

                // Assign characters: first N letters get target chars, rest stay random
                letters.forEach((l, i) => {
                    if (i < targets.length) {
                        l.el.textContent = targets[i].char;
                        l.role = 'target';
                    } else {
                        l.el.textContent = alphabet[Math.floor(Math.abs(Math.sin(i * 7.3 + phraseIdx * 3.7)) * alphabet.length)];
                        l.role = 'bg';
                    }
                });

                // Phase 1: BLINK — target letters flash orange briefly (staggered)
                for (let i = 0; i < targets.length; i++) {
                    const delay = 30 + Math.random() * 80;
                    setTimeout(() => {
                        letters[i].el.className = 'lm-letter lm-blink';
                        letters[i].el.style.opacity = '0.7';
                    }, i * delay);
                }
                await sleep(targets.length * 50 + 500);

                // Phase 2: GLOW — target letters start pulsing, increasingly stronger
                for (let i = 0; i < targets.length; i++) {
                    letters[i].el.className = 'lm-letter lm-glow';
                    letters[i].el.style.opacity = '0.85';
                    letters[i].el.style.zIndex = '10';
                }
                // Dim background letters further
                letters.forEach((l, i) => {
                    if (l.role === 'bg') {
                        l.el.style.opacity = '0.03';
                        l.el.className = 'lm-letter lm-frame';
                    }
                });
                await sleep(1200);

                // Phase 3: FORM — target letters fly to their positions
                const fontClamp = targets[0].fontClamp;
                for (let i = 0; i < targets.length; i++) {
                    const l = letters[i];
                    const t = targets[i];
                    l.el.className = 'lm-letter lm-formed';
                    l.el.style.fontSize = fontClamp;
                    l.el.style.opacity = '1';
                    l.el.style.transform = 'translate(-50%, -50%) rotate(0deg)';
                    l.el.style.left = t.x + 'px';
                    l.el.style.top = t.y + 'px';
                    l.el.style.zIndex = '10';
                }
                await sleep(2500);

                isAnimating = false;
            }

            // Scatter all letters back to random positions
            async function scatterBack() {
                isAnimating = true;
                seed = Date.now() % 100000;
                letters.forEach((l, i) => {
                    const pos = scatterPos(i);
                    l.el.className = 'lm-letter lm-scatter';
                    l.el.style.fontSize = pos.size;
                    l.el.style.left = pos.x;
                    l.el.style.top = pos.y;
                    l.el.style.opacity = (0.06 + Math.random() * 0.08).toFixed(2);
                    l.el.style.transform = 'translate(-50%, -50%) rotate(' + pos.rot + 'deg)';
                    l.el.style.zIndex = '1';
                    l.el.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
                });
                await sleep(1400);
                isAnimating = false;
            }

            function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

            // Initialize
            createLetters();

            // Auto-start on first visibility
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !el.dataset.initialized) {
                    el.dataset.initialized = "true";
                    animatePhrase(phrases[phraseIdx]);
                }
            });
            observer.observe(el);

            // Click / navigation to cycle phrases
            window.handleNextStep = () => {
                if (isAnimating) return true;
                if (phraseIdx < phrases.length - 1) {
                    (async () => {
                        await scatterBack();
                        phraseIdx++;
                        await animatePhrase(phrases[phraseIdx]);
                    })();
                    return true;
                }
                return false;
            };

            el.addEventListener('click', () => {
                if (el.dataset.initialized && !isAnimating) {
                    if (phraseIdx < phrases.length - 1) {
                        (async () => {
                            await scatterBack();
                            phraseIdx++;
                            await animatePhrase(phrases[phraseIdx]);
                        })();
                    }
                }
            });
        }, 100);

        return `
            <div class="slide-letter-morph" id="${id}">
                <div class="lm-hint">Klicka för nästa</div>
                <div class="lm-counter" id="${id}-counter"></div>
            </div>
        `;
    }

    /**
     * rewrite-progression - Typewriter replacing text in specific slots
     * Props: template, prefix (array), steps (array of objects mapping slot keys to text)
     */
    function renderRewriteProgression(s) {
        const id = 'rp-' + Math.random().toString(36).slice(2, 8);
        const tpl = s.template || '';
        const steps = s.steps || [];
        const prefixes = s.prefix || [];
        
        if (steps.length === 0) return '';
        
        const first = steps[0];
        const buildSentence = (step) => {
            let result = tpl;
            for (const key in step) {
                result = result.replace(`{${key}}`, `<span class="rw-slot" data-key="${key}">${step[key]}</span>`);
            }
            return result;
        };

        setTimeout(() => {
            const container = document.getElementById(id);
            if (!container) return;
            
            let currentStep = 0;
            let animating = false;
            const mainEl = container.querySelector('.rewrite-main');
            const prefixEl = container.querySelector('.rewrite-prefix');

            async function eraseSlot(slot, text) {
                slot.classList.add('active');
                for (let i = text.length; i >= 0; i--) {
                    slot.textContent = text.substring(0, i);
                    await new Promise(r => setTimeout(r, 40));
                }
            }

            async function typeSlot(slot, text, isChanged) {
                for (let i = 0; i <= text.length; i++) {
                    slot.textContent = text.substring(0, i);
                    await new Promise(r => setTimeout(r, 50));
                }
                slot.classList.remove('active');
                if (isChanged) slot.classList.add('changed');
            }

            async function transitionTo(stepIdx) {
                animating = true;
                const step = steps[stepIdx];
                const prevStep = steps[stepIdx - 1];

                const slots = mainEl.querySelectorAll('.rw-slot');
                slots.forEach(slot => slot.classList.remove('changed'));

                if (prefixEl && prefixes[stepIdx - 1]) {
                    prefixEl.textContent = prefixes[stepIdx - 1];
                    prefixEl.classList.add('visible');
                    await new Promise(r => setTimeout(r, 800));
                }

                // Run animations concurrently for all changed slots
                const animations = [];
                for (const slot of slots) {
                    const key = slot.dataset.key;
                    if (prevStep[key] !== step[key]) {
                        animations.push((async () => {
                            await eraseSlot(slot, prevStep[key] || '');
                            await new Promise(r => setTimeout(r, 200));
                            await typeSlot(slot, step[key] || '', true);
                        })());
                    }
                }
                await Promise.all(animations);

                await new Promise(r => setTimeout(r, 600));
                if (prefixEl) prefixEl.classList.remove('visible');
                animating = false;
            }

            window.handleNextStep = () => {
                if (animating) return true; // block until animation finishes
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    transitionTo(currentStep);
                    return true;
                }
                return false;
            };
            
            container.onclick = function(e) {
                if (window.handleNextStep && !window.handleNextStep()) {
                    if (typeof window.nextSlide === 'function') window.nextSlide();
                }
            };
        }, 100);

        return `
            <div class="slide-rewrite" id="${id}">
                <div class="rewrite-prefix"></div>
                <div class="rewrite-main">${buildSentence(first)}</div>
            </div>
        `;
    }

    /**
     * quote - Typewriter quote style
     * Props: text, author, style ("typewriter"), slowSpeed
     */
    function renderQuote(s) {
        const id = 'quote-' + Math.random().toString(36).slice(2, 8);
        const isTypewriter = s.style === 'typewriter';
        const rawText = s.text || '';
        const author = s.author || '';
        const slowSpeed = s.slowSpeed || false;
        
        if (isTypewriter) {
            setTimeout(() => {
                const container = document.getElementById(id + '-text');
                const authorEl = document.getElementById(id + '-author');
                if (!container) return;
                
                const baseDelay = slowSpeed ? 60 : 30;
                const randomDelay = slowSpeed ? 80 : 40;
                
                let chars = [];
                let inHighlight = false;
                let i = 0;
                while (i < rawText.length) {
                    if (rawText[i] === '*') {
                        inHighlight = !inHighlight;
                        i++;
                    } else {
                        chars.push({ char: rawText[i], highlight: inHighlight });
                        i++;
                    }
                }

                container.innerHTML = '';
                let charIndex = 0;

                function typeNext() {
                    if (charIndex < chars.length) {
                        const c = chars[charIndex];
                        if (c.highlight) {
                            container.innerHTML = container.innerHTML.replace(/<span class="cursor[^>]*>.*?<\/span>$/, '');
                            container.innerHTML += `<span class="highlight" style="color: var(--accent); font-weight: bold;">${c.char}</span><span class="cursor" style="display:inline-block; width:0.6em; height:1.1em; background:var(--accent); margin-left:0.2em; vertical-align:middle;"></span>`;
                        } else {
                            container.innerHTML = container.innerHTML.replace(/<span class="cursor[^>]*>.*?<\/span>$/, '');
                            container.innerHTML += c.char + '<span class="cursor" style="display:inline-block; width:0.6em; height:1.1em; background:currentColor; margin-left:0.2em; vertical-align:middle;"></span>';
                        }
                        charIndex++;
                        setTimeout(typeNext, baseDelay + Math.random() * randomDelay);
                    } else {
                        container.innerHTML = container.innerHTML.replace(/<span class="cursor[^>]*>.*?<\/span>$/, '');
                        container.innerHTML += '<span class="cursor" style="display:inline-block; width:0.6em; height:1.1em; background:currentColor; margin-left:0.2em; vertical-align:middle; animation: blink-cursor 0.8s step-end infinite;"></span>';
                        if (author && authorEl) {
                            authorEl.textContent = author.startsWith('—') ? author : '— ' + author;
                            authorEl.style.opacity = '0.6';
                        }
                    }
                }

                container.innerHTML = '<span class="cursor" style="display:inline-block; width:0.6em; height:1.1em; background:currentColor; margin-left:0.2em; vertical-align:middle;"></span>';
                setTimeout(typeNext, 500);
            }, 100);
            
            return `<div class="slide-quote typewriter" id="${id}" style="text-align: center; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50cqh;">
                <div class="quote-text" id="${id}-text" style="font-size: clamp(2rem, 4cqw, 3rem); font-weight: 300; line-height: 1.5; color: var(--text);"></div>
                <div class="quote-author" id="${id}-author" style="opacity:0; margin-top: 2rem; font-size: 1.5rem; transition: opacity 1s ease;"></div>
            </div>`;
        } else {
            const text = rawText.replace(/\*([^*]+)\*/g, '<span class="highlight" style="color: var(--accent); font-weight: bold;">$1</span>');
            return `<div class="slide-quote" style="text-align: center; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50cqh;">
                <div class="quote-text" style="font-size: clamp(2rem, 4cqw, 3rem); font-weight: 300; line-height: 1.5; color: var(--text);">${text}</div>
                ${author ? `<div class="quote-author" style="margin-top: 2rem; font-size: 1.5rem; opacity: 0.8;">— ${author}</div>` : ''}
            </div>`;
        }
    }

    /**
     * map-journey — Stylized map with an animated route connecting pins.
     * Props: title, mapImage, points[] ({ label, x, y })
     */
    function renderMapJourney(s) {
        const points = s.points || [];
        const pathData = points.length > 0 ? 'M ' + points.map(p => `${p.x} ${p.y}`).join(' L ') : '';
        
        const pinHtml = points.map(p => `
            <div class="mj-pin" style="left:${p.x}%; top:${p.y}%;">
                <div class="mj-label">${p.label}</div>
            </div>
        `).join('');

        return `
            <div class="slide-map-journey">
                ${s.title ? `<div class="mj-title" style="padding: 2rem; font-size: 2rem; font-weight: bold; color: var(--accent, #f97316);">${s.title}</div>` : ''}
                <div class="mj-container">
                    <img src="${s.mapImage || ''}" alt="Map">
                    <svg class="mj-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path class="mj-path" d="${pathData}" vector-effect="non-scaling-stroke" />
                    </svg>
                    ${pinHtml}
                </div>
            </div>
        `;
    }

    /**
     * mindmap-tree — Multi-level hierarchical mindmap with curved connections.
     * Props: title, root (string), branches[] ({ label, leaves: [string] })
     */
    function renderMindmapTree(s) {
        const root = s.root || 'Root';
        const branches = s.branches || [];
        
        let html = '';
        let svg = '';
        
        // Root at left center
        const rootX = 15;
        const rootY = 50;
        html += `<div class="mt-node mt-root" style="left:${rootX}%; top:${rootY}%;">${root}</div>`;
        
        const branchX = 45;
        const leafX = 85;
        
        branches.forEach((b, i) => {
            const branchY = 20 + (60 / Math.max(1, branches.length - 1)) * i;
            // Line from root to branch
            svg += `<path d="M ${rootX} ${rootY} C ${rootX+15} ${rootY}, ${branchX-15} ${branchY}, ${branchX} ${branchY}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" />`;
            html += `<div class="mt-node mt-branch" style="left:${branchX}%; top:${branchY}%;">${b.label}</div>`;
            
            if (b.leaves && b.leaves.length > 0) {
                b.leaves.forEach((l, j) => {
                    const leafOffset = (j - (b.leaves.length-1)/2) * 12; // vertical spread
                    const leafY = branchY + leafOffset;
                    // Line from branch to leaf
                    svg += `<path d="M ${branchX} ${branchY} C ${branchX+15} ${branchY}, ${leafX-15} ${leafY}, ${leafX} ${leafY}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" stroke-dasharray="4 4" />`;
                    html += `<div class="mt-node mt-leaf" style="left:${leafX}%; top:${leafY}%;">${l}</div>`;
                });
            }
        });

        return `
            <div class="slide-mindmap-tree">
                ${s.title ? `<div class="mt-title" style="position:absolute; top:2rem; left:3rem; font-size:2rem; font-weight:bold; color:var(--text, #f1f5f9);">${s.title}</div>` : ''}
                <div class="mt-canvas">
                    <svg class="mt-svg" viewBox="0 0 100 100" preserveAspectRatio="none">${svg}</svg>
                    ${html}
                </div>
            </div>
        `;
    }

    /**
     * warning-pulse - An animated exclamation mark warning slide.
     * Props: title, subtitle
     */
    function renderWarningPulse(s) {
        return `
            <div class="slide-warning-pulse">
                <div class="wp-mark-spinner">
                    <div class="wp-mark">!</div>
                </div>
                <div class="wp-title">${s.title || ''}</div>
                <div class="wp-subtitle">${s.subtitle || ''}</div>
            </div>
        `;
    }

    /**
     * token-spinner — Typewriter with slot-machine token generation
     * Props: text (string)
     */
    function renderTokenSpinner(s) {
        const id = 'ts-' + Math.random().toString(36).slice(2, 8);
        const rawText = s.text || '';
        
        // Split by spaces to animate word by word
        const words = rawText.split(' ').filter(w => w.length > 0);
        
        // Vocabulary for the LLM to "guess" from (more technical/statistical/predictive)
        const decoyWords = ["prediktera", "sannolikhet", "matris", "vektor", "kontext", "parametrar", "vikter", "algoritm", "data", "modell", "träningsdata", "inferens", "generera", "kalkylera", "kombinera", "statistiskt", "korrelation", "analys", "mönster", "beräkna", "chattbott", "kod", "syntax", "skriva", "läsa", "process", "eller", "som", "det", "är", "på", "till", "med", "för", "den", "har", "inte", "av", "om", "så", "bli", "maskininlärning", "neuralt", "nätverk"];

        setTimeout(() => {
            const container = document.getElementById(`${id}-content`);
            if (!container) return;
            
            let wordIdx = 0;
            
            async function processNextWord() {
                if (wordIdx >= words.length) return;
                const word = words[wordIdx];
                
                if (wordIdx === 0) {
                    // Type out the very first word
                    const span = document.createElement('span');
                    container.appendChild(span);
                    for (let i = 0; i < word.length; i++) {
                        span.textContent += word[i];
                        await new Promise(r => setTimeout(r, 60));
                    }
                    container.appendChild(document.createTextNode(' '));
                    
                    wordIdx++;
                    await new Promise(r => setTimeout(r, 200));
                    processNextWord();
                } else {
                    // Spin for all subsequent words
                    const spinnerWrapper = document.createElement('span');
                    spinnerWrapper.className = 'ts-spinner-wrapper ts-spinning';
                    
                    const probBadge = document.createElement('div');
                    probBadge.className = 'ts-prob-badge';
                    probBadge.textContent = '00.0%';
                    spinnerWrapper.appendChild(probBadge);

                    const spinnerMask = document.createElement('span');
                    spinnerMask.className = 'ts-spinner-mask';

                    const spinnerTrack = document.createElement('span');
                    spinnerTrack.className = 'ts-spinner-track';
                    
                    const trackOptions = [];
                    // Generate 6-10 random decoys
                    const numDecoys = 6 + Math.floor(Math.random() * 5);
                    for(let i=0; i < numDecoys; i++) {
                        trackOptions.push(decoyWords[Math.floor(Math.random() * decoyWords.length)]);
                    }
                    trackOptions.push(word); // The correct word is last
                    
                    trackOptions.forEach(opt => {
                        const wordDiv = document.createElement('div');
                        wordDiv.className = 'ts-spinner-word';
                        wordDiv.textContent = opt;
                        spinnerTrack.appendChild(wordDiv);
                    });
                    
                    spinnerMask.appendChild(spinnerTrack);
                    spinnerWrapper.appendChild(spinnerMask);
                    container.appendChild(spinnerWrapper);
                    
                    // Trigger CSS animation
                    await new Promise(r => setTimeout(r, 30));
                    
                    const targetY = -((trackOptions.length - 1) * 1.2);
                    
                    // The spin duration should be fast but visible (e.g., 0.8s to 1.2s)
                    const duration = 0.8 + Math.random() * 0.4;
                    spinnerTrack.style.transition = `transform ${duration}s cubic-bezier(0.1, 0.8, 0.2, 1)`;
                    spinnerTrack.style.transform = `translateY(${targetY}em)`;
                    
                    // Flash probabilities rapidly while spinning
                    const startTime = Date.now();
                    const probInterval = setInterval(() => {
                        probBadge.textContent = (Math.random() * 85).toFixed(1) + '%';
                    }, 50);

                    // Wait for spin to finish
                    await new Promise(r => setTimeout(r, duration * 1000 + 50));
                    clearInterval(probInterval);
                    
                    // Solidify
                    probBadge.textContent = (95 + Math.random() * 4.9).toFixed(1) + '%';
                    spinnerWrapper.classList.remove('ts-spinning');
                    spinnerWrapper.classList.add('ts-solidified');
                    container.appendChild(document.createTextNode(' '));
                    
                    wordIdx++;
                    
                    // Dynamic pauses based on punctuation
                    let pause = 150;
                    if (word.endsWith('.') || word.endsWith(',') || word.endsWith(':')) pause = 700;
                    
                    // Dramatic cliffhanger pause before "Eller?"
                    if (wordIdx < words.length && words[wordIdx].toLowerCase().includes('eller')) {
                        pause = 2000;
                    }
                    
                    await new Promise(r => setTimeout(r, pause));
                    processNextWord();
                }
            }
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !container.dataset.started) {
                    container.dataset.started = 'true';
                    setTimeout(processNextWord, 500);
                }
            });
            observer.observe(container);
            
        }, 100);

        return `
            <div class="slide-token-spinner" id="${id}">
                <div class="ts-content" id="${id}-content"></div>
            </div>
        `;
    }

    /**
     * bento-grid: A modern CSS grid for features
     */
    function renderBentoGrid(s) {
        const id = 'bento-' + Math.random().toString(36).slice(2, 8);
        const cols = s.columns || 3;
        let html = `<div class="slide-bento-grid no-click-advance" id="${id}" style="--bento-cols:${cols}">`;
        if (s.title) html += `<h2 class="bento-title">${s.title}</h2>`;
        html += `<div class="bento-container">`;
        (s.items || []).forEach((item, i) => {
            const iconHtml = item.iconSrc
                ? `<img class="bento-icon-img" src="${item.iconSrc}" alt="${item.title || ''}" />`
                : `<div class="bento-icon">${item.icon || '✨'}</div>`;
            html += `
                <div class="bento-item step-hidden" style="grid-column: span ${item.colSpan || 1};">
                    ${iconHtml}
                    <h3 class="bento-item-title">${item.title}</h3>
                    <div class="bento-item-text">${item.text}</div>
                </div>
            `;
        });
        html += `</div>`;
        html += renderSourcesPopup(s.sources);
        html += `</div>`;

        // Click to reveal logic
        setTimeout(() => {
            const container = document.getElementById(id);
            if (!container) return;
            const items = container.querySelectorAll('.bento-item');
            let currentStep = 0;
            
            // Show first item automatically after a short delay
            setTimeout(() => {
                if(items.length > 0) items[0].classList.remove('step-hidden');
                currentStep = 1;
            }, 500);

            container.addEventListener('click', (e) => {
                if (currentStep < items.length) {
                    e.stopPropagation();
                    items[currentStep].classList.remove('step-hidden');
                    currentStep++;
                } else {
                    container.classList.remove('no-click-advance');
                }
            });
        }, 100);

        return html;
    }

    /**
     * glitch-warning: A high-impact warning slide
     */
    function renderGlitchWarning(s) {
        const id = 'glitch-' + Math.random().toString(36).slice(2, 8);
        let html = `<div class="slide-glitch-warning no-click-advance" id="${id}">`;
        html += `<div class="glitch-wrapper">`;
        if (s.glitchText) html += `<h1 class="glitch" data-text="${s.glitchText}">${s.glitchText}</h1>`;
        if (s.subtitle) html += `<div class="glitch-subtitle">${s.subtitle}</div>`;
        if (s.warnings && s.warnings.length > 0) {
            html += `<div class="glitch-list">`;
            s.warnings.forEach((w, i) => {
                html += `<div class="glitch-list-item step-hidden">${w}</div>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
        html += renderSourcesPopup(s.sources);
        html += `</div>`;

        // Click to reveal logic
        setTimeout(() => {
            const container = document.getElementById(id);
            if (!container) return;
            const items = container.querySelectorAll('.glitch-list-item');
            let currentStep = 0;
            // Show first item automatically after a short delay
            setTimeout(() => {
                if(items.length > 0) items[0].classList.remove('step-hidden');
                currentStep = 1;
            }, 500);

            container.addEventListener('click', (e) => {
                if (currentStep < items.length) {
                    e.stopPropagation();
                    items[currentStep].classList.remove('step-hidden');
                    currentStep++;
                } else {
                    container.classList.remove('no-click-advance');
                }
            });
        }, 100);

        return html;
    }

    // ===== SEMANTIC NEBULA =====
    function renderSemanticNebula(s) {
        const id = 'sn-' + Math.random().toString(36).slice(2, 8);
        const startWord = s.startWord || "PROMPT";
        const titleText = s.title || "Latent Semantisk Rymd";
        
        // Custom CSS injected globally once
        if (!document.getElementById('css-semantic-nebula')) {
            const style = document.createElement('style');
            style.id = 'css-semantic-nebula';
            style.innerHTML = `
                .slide-semantic-nebula { 
                    position: absolute; inset: 0; width: 100cqw; height: 100cqh; 
                    background: radial-gradient(circle at center, #020617 0%, #000000 100%); overflow: hidden; display: flex; 
                    flex-direction: column; align-items: center; justify-content: center; 
                }
                .sn-canvas-container { position: absolute; inset: 0; z-index: 1; }
                .sn-canvas { width: 100%; height: 100%; display: block; }
                .sn-sidebar { 
                    position: absolute; top: 0; bottom: 0; right: 0; 
                    width: 42cqw; max-width: 600px; 
                    background: linear-gradient(to left, rgba(0,0,0,0.96) 20%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 85%, transparent); 
                    display: flex; flex-direction: column; justify-content: center; 
                    padding: 4cqh 4cqw 4cqh 3cqw; pointer-events: none; z-index: 10; gap: 2cqh; 
                }
                .sn-sentence { 
                    color: rgba(255,255,255,0.7); 
                    font-size: clamp(0.85rem, 2.5cqh, 1.4rem); 
                    font-weight: 300; 
                    line-height: 1.4; 
                    letter-spacing: 0.02em;
                    opacity: 0; 
                    transform: translateY(20px) scale(0.97); 
                    transition: all 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    text-shadow: 0 0 40px rgba(255, 180, 100, 0.15);
                    border-left: 4px solid transparent;
                    padding: 1cqh 2cqw;
                    border-radius: 1cqh;
                    background: rgba(15, 23, 42, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                }
                .sn-sentence.active { 
                    opacity: 1; 
                    color: #fff;
                    font-weight: 400;
                    transform: translateY(0) scale(1); 
                    border-left-color: #f59e0b; /* Gorgeous Amber/Gold active line */
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.1);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    text-shadow: 0 0 50px rgba(245, 158, 11, 0.25), 0 0 10px rgba(255,255,255,0.1);
                }
                .sn-sentence.fade-out { 
                    opacity: 0; 
                    transform: translateY(-20px) scale(0.97); 
                    transition: opacity 1s ease-in, transform 1s ease-in;
                }
                @keyframes snWordFade { to { opacity: 1; } }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            const canvas = document.getElementById(`${id}-canvas`);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let w, h;
            function resize() {
                const rect = canvas.parentElement.getBoundingClientRect();
                w = canvas.width = rect.width * window.devicePixelRatio;
                h = canvas.height = rect.height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                w /= window.devicePixelRatio;
                h /= window.devicePixelRatio;
            }
            window.addEventListener('resize', resize);
            resize();

            // 3D Engine Variables
            let time = 0;
            let camZ = 0; // Flight through space
            let camX = 0; // Sway left/right
            let cx = w / 2;
            let cy = h / 2;
            
            // Galaxy clusters organized in thematic SUPER-CLUSTERS (hopar)
            const clusters = [];
            
            // Each super-cluster has a theme, hue, and spatial anchor
            const superClusters = [
                { theme: 'språk', hue: 200, words: ['ord', 'mening', 'syntax', 'kontext', 'semantik', 'fras', 'token', 'språk'], anchorX: -500, anchorY: -200 },
                { theme: 'logik', hue: 45, words: ['logik', 'struktur', 'mönster', 'kedja', 'slutsats', 'premiss', 'induktion', 'bevis'], anchorX: 400, anchorY: -300 },
                { theme: 'biologi', hue: 120, words: ['neural', 'synaps', 'koppling', 'nod', 'nätverk', 'signal', 'impuls', 'cortex'], anchorX: -300, anchorY: 300 },
                { theme: 'sinnen', hue: 320, words: ['bild', 'ton', 'känsla', 'intuition', 'perception', 'minne', 'dröm', 'association'], anchorX: 500, anchorY: 250 },
                { theme: 'matematik', hue: 280, words: ['vektor', 'matris', 'vikt', 'dimension', 'rum', 'avstånd', 'gradient', 'funktion'], anchorX: 0, anchorY: -450 }
            ];
            
            superClusters.forEach((sc, sci) => {
                const numInGroup = 5 + Math.floor(Math.random() * 3); // 5-7 galaxes per super-cluster
                for (let i = 0; i < numInGroup; i++) {
                    const spread = 250; // How far apart galaxes in a group are
                    clusters.push({
                        origX: sc.anchorX + (Math.random() - 0.5) * spread,
                        origY: sc.anchorY + (Math.random() - 0.5) * spread,
                        origZ: sci * 500 + Math.random() * 400,
                        hue: sc.hue + (Math.random() - 0.5) * 30, // Slight hue variation within group
                        radius: 60 + Math.random() * 80,
                        superCluster: sci,
                        words: Array(4 + Math.floor(Math.random() * 4)).fill(0).map(() => ({
                            dx: (Math.random() - 0.5) * 2.5,
                            dy: (Math.random() - 0.5) * 2.5,
                            txt: sc.words[Math.floor(Math.random() * sc.words.length)]
                        })),
                        pulse: 0
                    });
                }
            });

            // PERIPHERAL clusters — far off at the edges, rarely targeted
            const peripherals = [
                { theme: 'poesi', hue: 350, words: ['metafor', 'rytm', 'vers', 'klang', 'bild', 'stämning'], anchorX: -1100, anchorY: 0 },
                { theme: 'humor', hue: 55, words: ['ironi', 'timing', 'absurd', 'vits', 'parodi', 'satir'], anchorX: 1100, anchorY: -150 },
                { theme: 'musik', hue: 170, words: ['harmoni', 'ackord', 'tonart', 'resonans', 'melodi', 'tempo'], anchorX: 900, anchorY: 400 }
            ];
            
            peripherals.forEach((pc, pci) => {
                const numInGroup = 3 + Math.floor(Math.random() * 2);
                for (let i = 0; i < numInGroup; i++) {
                    clusters.push({
                        origX: pc.anchorX + (Math.random() - 0.5) * 180,
                        origY: pc.anchorY + (Math.random() - 0.5) * 180,
                        origZ: 300 + Math.random() * 2000,
                        hue: pc.hue + (Math.random() - 0.5) * 20,
                        radius: 40 + Math.random() * 50,
                        superCluster: 5 + pci, // separate from main 0-4
                        isPeripheral: true,
                        words: Array(3 + Math.floor(Math.random() * 3)).fill(0).map(() => ({
                            dx: (Math.random() - 0.5) * 2.5,
                            dy: (Math.random() - 0.5) * 2.5,
                            txt: pc.words[Math.floor(Math.random() * pc.words.length)]
                        })),
                        pulse: 0
                    });
                }
            });

            // Rays and Particles
            let activeRay = null;
            let lastTarget = null;
            let rayWait = 0;
            const particles = [];
            
            // Faint, background stars
            const stars = [];
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: (Math.random() - 0.5) * 2000,
                    y: (Math.random() - 0.5) * 2000,
                    z: Math.random() * 2000,
                    size: 0.5 + Math.random() * 1.5,
                    opacity: 0.2 + Math.random() * 0.8
                });
            }

            // Nebula state
            let nebulaSize = 5;
            let nebulaPulse = 0;
            let nebulaHues = [];

            function draw() {
                cx = w / 2;
                cy = h / 2;
                
                ctx.fillStyle = 'rgba(0, 0, 0, 0.35)'; // Crisper trails
                ctx.fillRect(0, 0, w, h);
                
                time += 0.01;
                const camSpeed = 1.2 + time * 0.5; // Accelerates continuously
                camZ += camSpeed;
                camX = Math.sin(time * 0.3) * 80; // Gentle lateral sway

                // Draw background stars
                stars.forEach(star => {
                    let sz = star.z - camZ * 0.15; // drift stars slower than clusters
                    while (sz < 0) sz += 2000;
                    while (sz > 2000) sz -= 2000;
                    
                    const starScale = 500 / (500 + sz);
                    const sx = cx + star.x * starScale - camX * 0.3;
                    const sy = cy + star.y * starScale;
                    
                    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
                        const starOpacity = star.opacity * Math.abs(Math.sin(time * 2 + star.z)) * starScale * 0.8;
                        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, starOpacity))})`;
                        ctx.beginPath();
                        ctx.arc(sx, sy, star.size * starScale, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                
                // Draw Nebula in center
                nebulaPulse += 0.05;
                const currentNebRadius = nebulaSize + Math.sin(nebulaPulse) * (nebulaSize * 0.1);
                
                if (nebulaHues.length > 0) {
                    const mixHue = nebulaHues[Math.floor((time * 10) % nebulaHues.length)];
                    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, currentNebRadius * 2.5);
                    grad.addColorStop(0, 'hsla(' + mixHue + ', 100%, 80%, 0.9)');
                    grad.addColorStop(0.3, 'hsla(' + mixHue + ', 100%, 50%, 0.5)');
                    grad.addColorStop(1, 'hsla(' + mixHue + ', 100%, 10%, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(cx, cy, currentNebRadius * 2.5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, currentNebRadius);
                    grad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
                    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = grad;
                    ctx.fill();
                }

                const fov = 500;
                
                // Project all clusters
                clusters.forEach((c, idx) => {
                    const angle = time * 0.12 + idx * 0.7;
                    const rx = Math.cos(angle) * c.origX - Math.sin(angle) * c.origZ * 0.3 - camX;
                    
                    let dz = c.origZ - camZ;
                    while (dz < -200) dz += 2800;
                    while (dz > 2600) dz -= 2800;
                    
                    const ry = c.origY + Math.sin(time * 0.4 + idx) * 120;
                    
                    const scale = fov / (fov + dz);
                    c.projX = cx + rx * scale;
                    c.projY = cy + ry * scale;
                    c.scale = Math.max(0, scale);
                    c.dz = dz;
                    c.visible = dz > 10;
                });

                // Draw inter-cluster nebulae (connecting mist within super-clusters)
                superClusters.forEach((sc, sci) => {
                    const groupClusters = clusters.filter(c => c.superCluster === sci && c.visible && c.scale > 0.15);
                    if (groupClusters.length < 2) return;
                    
                    // Find center of mass for this group
                    let avgX = 0, avgY = 0, avgScale = 0;
                    groupClusters.forEach(c => { avgX += c.projX; avgY += c.projY; avgScale += c.scale; });
                    avgX /= groupClusters.length;
                    avgY /= groupClusters.length;
                    avgScale /= groupClusters.length;
                    
                    // Draw a large, faint connecting nebula
                    const nebRad = 200 * avgScale;
                    if (nebRad > 15) {
                        const nebGrad = ctx.createRadialGradient(avgX, avgY, 0, avgX, avgY, nebRad);
                        nebGrad.addColorStop(0, 'hsla(' + sc.hue + ', 60%, 40%, ' + (0.025 * avgScale) + ')');
                        nebGrad.addColorStop(0.6, 'hsla(' + sc.hue + ', 60%, 25%, ' + (0.012 * avgScale) + ')');
                        nebGrad.addColorStop(1, 'hsla(' + sc.hue + ', 60%, 10%, 0)');
                        ctx.fillStyle = nebGrad;
                        ctx.beginPath();
                        ctx.arc(avgX, avgY, nebRad, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });

                // Draw clusters with larger, more visible words
                clusters.forEach(c => {
                    if (!c.visible) return;
                    c.pulse *= 0.93;
                    
                    // Draw cluster core
                    const crad = c.radius * c.scale;
                    const cgrad = ctx.createRadialGradient(c.projX, c.projY, 0, c.projX, c.projY, crad);
                    cgrad.addColorStop(0, 'hsla(' + c.hue + ', 80%, 60%, ' + (0.1 + c.pulse) + ')');
                    cgrad.addColorStop(1, 'hsla(' + c.hue + ', 80%, 20%, 0)');
                    ctx.fillStyle = cgrad;
                    ctx.beginPath();
                    ctx.arc(c.projX, c.projY, crad, 0, Math.PI * 2);
                    ctx.fill();

                    // Draw words — much larger and more visible
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const wordSize = Math.max(14, Math.round(20 * c.scale));
                    c.words.forEach((wObj, wi) => {
                        const wx = c.projX + Math.cos(time * 0.6 + wi * 1.3) * crad * 0.7 * wObj.dx;
                        const wy = c.projY + Math.sin(time * 0.6 + wi * 1.3) * crad * 0.7 * wObj.dy;
                        const wordAlpha = Math.min(0.85, 0.45 + c.pulse * 0.5) * Math.min(1, c.scale * 2);
                        if (wordAlpha <= 0.05) return;
                        
                        ctx.font = `600 ${wordSize}px 'Inter', sans-serif`;
                        
                        // Faint outline for absolute readability over bright spots
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
                        ctx.lineWidth = 3;
                        ctx.strokeText(wObj.txt, wx, wy);
                        
                        ctx.fillStyle = 'hsla(' + c.hue + ', 100%, ' + (80 + c.pulse * 20) + '%, ' + wordAlpha + ')';
                        ctx.fillText(wObj.txt, wx, wy);
                    });
                });

                // Logic: Elegant thread jumping between clusters
                if (!activeRay && rayWait <= 0) {
                    let nextTarget;
                    let attempts = 0;
                    
                    // ~12% chance to target a peripheral cluster (long-range association)
                    const goPeripheral = Math.random() < 0.12;
                    const candidates = goPeripheral 
                        ? clusters.filter(c => c.isPeripheral && c.visible)
                        : clusters.filter(c => !c.isPeripheral && c.visible);
                    
                    if (candidates.length > 0) {
                        do {
                            nextTarget = candidates[Math.floor(Math.random() * candidates.length)];
                            attempts++;
                        } while (nextTarget === lastTarget && attempts < 10);
                    } else {
                        // Fallback to any visible cluster
                        do {
                            nextTarget = clusters[Math.floor(Math.random() * clusters.length)];
                            attempts++;
                        } while ((nextTarget === lastTarget || nextTarget.dz < 200) && attempts < 10);
                    }

                    activeRay = {
                        target: nextTarget,
                        hue: nextTarget.hue,
                        progress: 0,
                        curveOffset: (Math.random() - 0.5) * 400
                    };
                }
                if (rayWait > 0) rayWait--;

                // Update and draw active ray (the searching thread)
                if (activeRay) {
                    let startX = cx, startY = cy;
                    if (lastTarget) {
                        startX = lastTarget.projX;
                        startY = lastTarget.projY;
                    }
                    const endX = activeRay.target.projX;
                    const endY = activeRay.target.projY;
                    
                    activeRay.progress += 0.012; // Slow, organic speed
                    
                    const t = activeRay.progress;
                    
                    // Calculate bezier curve for a soft organic thread
                    const cpx = (startX + endX) / 2 + activeRay.curveOffset;
                    const cpy = (startY + endY) / 2 - 200;
                    
                    const curX = (1-t)*(1-t)*startX + 2*(1-t)*t*cpx + t*t*endX;
                    const curY = (1-t)*(1-t)*startY + 2*(1-t)*t*cpy + t*t*endY;
                    
                    // 1. Thicker neon glow layer
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(cpx, cpy, curX, curY);
                    ctx.strokeStyle = `hsla(${activeRay.hue}, 100%, 65%, 0.15)`;
                    ctx.lineWidth = 7;
                    ctx.stroke();

                    // 2. High-intensity core laser line
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(cpx, cpy, curX, curY);
                    ctx.strokeStyle = `hsla(${activeRay.hue}, 100%, 85%, 0.6)`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Draw the glowing "head" of the thread with dual layers
                    ctx.beginPath();
                    ctx.arc(curX, curY, 4, 0, Math.PI*2);
                    ctx.fillStyle = `#ffffff`;
                    ctx.shadowColor = `hsla(${activeRay.hue}, 100%, 70%, 1)`;
                    ctx.shadowBlur = 20;
                    ctx.fill();

                    ctx.beginPath();
                    ctx.arc(curX, curY, 1.5, 0, Math.PI*2);
                    ctx.fillStyle = `#ffffff`;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    if (activeRay.progress >= 1) {
                        activeRay.target.pulse = 1.5; // Soft glow on the hit cluster
                        
                        // Extract meaning! A particle carrying a word floats back via the viewer
                        const harvestedWord = activeRay.target.words[Math.floor(Math.random() * activeRay.target.words.length)].txt;
                        particles.push({
                            startX: endX, startY: endY,
                            x: endX, y: endY,
                            hue: activeRay.hue,
                            progress: 0,
                            phase: 0, // 0 = fly to viewer, 1 = pause near viewer, 2 = fly to nebula
                            phaseTimer: 0,
                            speed: 0.012 + Math.random() * 0.006,
                            word: harvestedWord,
                            curveOffset: (Math.random() - 0.5) * 300,
                            // Viewer position: slightly off-center left, for cinematic feel
                            viewerX: cx * 0.35 + Math.random() * cx * 0.3,
                            viewerY: cy * 0.6 + Math.random() * cy * 0.3
                        });
                        
                        lastTarget = activeRay.target;
                        activeRay = null;
                        rayWait = 40; // Pause to admire the harvest before moving on
                    }
                }

                // Update and draw harvested particles (three-phase flyby)
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    let curX, curY, fontSize, alpha, orbSize;
                    
                    if (p.phase === 0) {
                        // Phase 0: Fly from cluster toward viewer
                        p.progress += p.speed;
                        const t = p.progress;
                        const cpx = (p.startX + p.viewerX) / 2 + p.curveOffset * 0.5;
                        const cpy = Math.min(p.startY, p.viewerY) - 120;
                        curX = (1-t)*(1-t)*p.startX + 2*(1-t)*t*cpx + t*t*p.viewerX;
                        curY = (1-t)*(1-t)*p.startY + 2*(1-t)*t*cpy + t*t*p.viewerY;
                        // Growing as it approaches
                        fontSize = 14 + t * 34; // 14px → 48px
                        alpha = 0.4 + t * 0.6;
                        orbSize = 4 + t * 8;
                        
                        if (p.progress >= 1) {
                            p.phase = 1;
                            p.phaseTimer = 0;
                            p.progress = 0;
                        }
                    } else if (p.phase === 1) {
                        // Phase 1: Pause near viewer — word is large and readable
                        p.phaseTimer++;
                        curX = p.viewerX + Math.sin(p.phaseTimer * 0.03) * 8; // gentle float
                        curY = p.viewerY + Math.cos(p.phaseTimer * 0.04) * 5;
                        fontSize = 48;
                        alpha = 1;
                        orbSize = 12;
                        
                        if (p.phaseTimer > 90) { // ~1.5 seconds at 60fps
                            p.phase = 2;
                            p.progress = 0;
                            p.pauseX = curX;
                            p.pauseY = curY;
                        }
                    } else {
                        // Phase 2: Drift into the nebula center
                        p.progress += p.speed * 0.8;
                        const t = p.progress;
                        const cpx = (p.pauseX + cx) / 2 + p.curveOffset * 0.3;
                        const cpy = (p.pauseY + cy) / 2 + 80;
                        curX = (1-t)*(1-t)*p.pauseX + 2*(1-t)*t*cpx + t*t*cx;
                        curY = (1-t)*(1-t)*p.pauseY + 2*(1-t)*t*cpy + t*t*cy;
                        // Shrinking and fading as it enters nebula
                        fontSize = 48 * (1 - t * 0.7); // 48 → ~14
                        alpha = 1 - t;
                        orbSize = 12 * (1 - t * 0.6);
                        
                        if (p.progress >= 1) {
                            nebulaSize = Math.min(nebulaSize + 3, 120);
                            if (!nebulaHues.includes(p.hue)) nebulaHues.push(p.hue);
                            particles.splice(i, 1);
                            continue;
                        }
                    }
                    
                    // Draw a subtle halo/ring around the orb for scientific depth
                    ctx.beginPath();
                    ctx.arc(curX, curY, orbSize * 1.8, 0, Math.PI * 2);
                    ctx.strokeStyle = `hsla(${p.hue}, 100%, 75%, ${alpha * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Draw the glowing orb
                    ctx.beginPath();
                    ctx.arc(curX, curY, orbSize, 0, Math.PI*2);
                    ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${alpha * 0.85})`;
                    ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, 1)`;
                    ctx.shadowBlur = orbSize * 2.5;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    
                    // The harvested word (technical monospaced look)
                    const fontFam = "'JetBrains Mono', 'Courier New', monospace";
                    ctx.font = `bold ${fontSize}px ${fontFam}`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    // Dark, high-contrast text shadow for absolute legibility
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    ctx.shadowBlur = 8;
                    
                    // Backing text trace for maximum outline readability
                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                    ctx.lineWidth = 4;
                    ctx.strokeText(p.word, curX, curY - orbSize - 14);
                    
                    // High-vibrancy foreground text
                    ctx.fillStyle = `hsla(${p.hue}, 100%, 95%, ${alpha})`;
                    ctx.fillText(p.word, curX, curY - orbSize - 14);
                    ctx.shadowBlur = 0;
                }


                if(document.getElementById(id)) {
                    requestAnimationFrame(draw);
                }
            }
            draw();

            const sidebar = document.getElementById(`${id}-sidebar`);
            if (sidebar) {
                const sentences = s.sentences || [
                    "AI söker inte i en databas.",
                    "Den navigerar i ett oändligt hav av mening.",
                    "Den drar till sig relaterade begrepp.",
                    "Fakta, mönster och toner kondenseras...",
                    "...tills ett nytt svar dröms fram."
                ];
                
                let currentSentence = 0;
                function showNextSentence() {
                    if(!document.getElementById(id)) return;
                    const el = document.createElement('div');
                    el.className = 'sn-sentence';
                    el.innerText = sentences[currentSentence];
                    sidebar.appendChild(el);
                    
                    if (sidebar.children.length > 3) {
                        const old = sidebar.children[0];
                        old.classList.add('fade-out');
                        setTimeout((node) => { if(node && node.parentNode) node.parentNode.removeChild(node); }, 1200, old);
                    }
                    
                    void el.offsetWidth; // force reflow
                    el.classList.add('active');
                    
                    currentSentence = (currentSentence + 1) % sentences.length;
                    setTimeout(showNextSentence, 4500);
                }
                showNextSentence();
            }

        }, 100);

        return `
            <div class="slide-semantic-nebula" id="${id}">
                <div class="sn-canvas-container">
                    <canvas class="sn-canvas" id="${id}-canvas"></canvas>
                </div>
                <div class="sn-sidebar" id="${id}-sidebar"></div>
            </div>
        `;
    }

    // ===== VECTOR NEBULA =====
    function renderVectorNebula(s) {
        const id = 'vn-' + Math.random().toString(36).slice(2, 8);
        const sentences = s.sentences || [
            "Ord kan representeras som <strong>vektorer</strong> (koordinater) i ett matematiskt rum baserat på deras semantiska innebörd.",
            "Skillnaden mellan 'Man' och 'Kung' kan beskrivas som en riktningspil – en vektor för <strong>+ Status</strong>.",
            "Om vi tar samma förändringsvektor och flyttar den parallellt så att den utgår från ordet 'Kvinna'...",
            "...så landar vi perfekt på koordinaten för <strong>'Drottning'</strong>! Formel: <strong>Kung - Man + Kvinna = Drottning</strong>.",
            "Men i verkliga AI-modeller arbetar vi inte bara i 2 dimensioner... utan i <strong>tusentals dimensioner</strong> samtidigt!"
        ];

        // Custom CSS injected globally once
        if (!document.getElementById('css-vector-nebula')) {
            const style = document.createElement('style');
            style.id = 'css-vector-nebula';
            style.innerHTML = `
                .slide-vector-nebula { 
                    position: absolute; inset: 0; width: 100cqw; height: 100cqh; 
                    background: radial-gradient(circle at center, #020617 0%, #000000 100%); overflow: hidden; display: flex; 
                    flex-direction: column; align-items: center; justify-content: center; 
                }
                .vn-canvas-container { position: absolute; inset: 0; z-index: 1; }
                .vn-canvas { width: 100%; height: 100%; display: block; }
                
                .vn-formula-badge {
                    position: absolute; top: 8cqh; left: 50%; transform: translateX(-50%) translateY(20px);
                    background: linear-gradient(135deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%);
                    border: 1px solid rgba(245, 158, 11, 0.4);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(245, 158, 11, 0.15);
                    border-radius: 12px; padding: 1.5cqh 3cqw;
                    font-family: 'JetBrains Mono', monospace; font-size: clamp(0.9rem, 2.5cqmin, 2rem);
                    font-weight: 700; color: #fff; z-index: 10; opacity: 0;
                    transition: all 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    pointer-events: none;
                }
                .vn-formula-badge.visible {
                    opacity: 1; transform: translateX(-50%) translateY(0);
                }
                .vn-formula-badge span.math-var { color: #f59e0b; text-shadow: 0 0 10px rgba(245,158,11,0.3); }
                .vn-formula-badge span.math-op { color: rgba(255,255,255,0.6); margin: 0 0.5cqw; }

                .vn-caption-bar {
                    position: absolute; bottom: 8cqh; left: 10%; right: 10%;
                    background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                    border-radius: 12px; padding: 2cqh 3cqw;
                    color: #e2e8f0; font-size: clamp(0.85rem, 2.3cqmin, 1.4rem);
                    text-align: center; font-weight: 300; line-height: 1.5;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
                    z-index: 10;
                    transition: all 0.5s ease;
                }
                .vn-caption-bar strong { font-weight: 700; color: #f59e0b; }
                
                .vn-click-hint {
                    position: absolute; bottom: 3cqh; right: 5%;
                    font-size: clamp(0.55rem, 1.2cqmin, 0.85rem); color: rgba(255,255,255,0.35);
                    font-family: 'JetBrains Mono', monospace; z-index: 10;
                    pointer-events: none; animation: vnBlink 2s infinite;
                }
                @keyframes vnBlink { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            const container = document.getElementById(id);
            const canvas = document.getElementById(`${id}-canvas`);
            const formulaBadge = document.getElementById(`${id}-formula`);
            const captionBar = document.getElementById(`${id}-caption`);
            const clickHint = document.getElementById(`${id}-hint`);
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let w, h;
            function resize() {
                const rect = canvas.parentElement.getBoundingClientRect();
                w = canvas.width = rect.width * window.devicePixelRatio;
                h = canvas.height = rect.height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                w /= window.devicePixelRatio;
                h /= window.devicePixelRatio;
            }
            window.addEventListener('resize', resize);
            resize();

            let currentStep = 0;
            
            // Animation variables (Smooth interpolation)
            let arrow1Length = 0;
            let arrow2Slide = 0;
            let revealProgress = 0;
            let morfProgress = 0;
            let exploded = false;
            const explosionParticles = [];

            // Caption setter
            function updateUI() {
                if (captionBar) {
                    captionBar.innerHTML = sentences[currentStep] || "";
                }
                if (currentStep === 3) {
                    if (formulaBadge) formulaBadge.classList.add('visible');
                } else if (currentStep > 3) {
                    if (formulaBadge) formulaBadge.classList.remove('visible');
                }
                if (currentStep === 4) {
                    if (clickHint) clickHint.innerText = "KLICKA FÖR NÄSTA SLIDE";
                    // Once 3D morph has started, allow slide advance after a delay
                    setTimeout(() => {
                        if (container) container.classList.remove('no-click-advance');
                    }, 1500);
                }
            }
            updateUI();

            // Clicks trigger steps
            container.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('.source-popup')) return;
                
                if (currentStep < 4) {
                    e.stopPropagation();
                    currentStep++;
                    updateUI();
                }
            });

            // 3D NEBULA STUFF (Initialized exactly as in renderSemanticNebula)
            let time = 0;
            let camZ = 0;
            let camX = 0;
            
            const clusters = [];
            const superClusters = [
                { theme: 'språk', hue: 200, words: ['ord', 'mening', 'syntax', 'kontext', 'semantik', 'fras', 'token', 'språk'], anchorX: -500, anchorY: -200 },
                { theme: 'logik', hue: 45, words: ['logik', 'struktur', 'mönster', 'kedja', 'slutsats', 'premiss', 'induktion', 'bevis'], anchorX: 400, anchorY: -300 },
                { theme: 'biologi', hue: 120, words: ['neural', 'synaps', 'koppling', 'nod', 'nätverk', 'signal', 'impuls', 'cortex'], anchorX: -300, anchorY: 300 },
                { theme: 'sinnen', hue: 320, words: ['bild', 'ton', 'känsla', 'intuition', 'perception', 'minne', 'dröm', 'association'], anchorX: 500, anchorY: 250 },
                { theme: 'matematik', hue: 280, words: ['vektor', 'matris', 'vikt', 'dimension', 'rum', 'avstånd', 'gradient', 'funktion'], anchorX: 0, anchorY: -450 }
            ];
            
            superClusters.forEach((sc, sci) => {
                const numInGroup = 5 + Math.floor(Math.random() * 3);
                for (let i = 0; i < numInGroup; i++) {
                    const spread = 250;
                    clusters.push({
                        origX: sc.anchorX + (Math.random() - 0.5) * spread,
                        origY: sc.anchorY + (Math.random() - 0.5) * spread,
                        origZ: sci * 500 + Math.random() * 400,
                        hue: sc.hue + (Math.random() - 0.5) * 30,
                        radius: 60 + Math.random() * 80,
                        superCluster: sci,
                        words: Array(4 + Math.floor(Math.random() * 4)).fill(0).map(() => ({
                            dx: (Math.random() - 0.5) * 2.5,
                            dy: (Math.random() - 0.5) * 2.5,
                            txt: sc.words[Math.floor(Math.random() * sc.words.length)]
                        })),
                        pulse: 0
                    });
                }
            });

            // Peripheral clusters
            const peripherals = [
                { theme: 'poesi', hue: 350, words: ['metafor', 'rytm', 'vers', 'klang', 'bild', 'stämning'], anchorX: -1100, anchorY: 0 },
                { theme: 'humor', hue: 55, words: ['ironi', 'timing', 'absurd', 'vits', 'parodi', 'satir'], anchorX: 1100, anchorY: -150 },
                { theme: 'musik', hue: 170, words: ['harmoni', 'ackord', 'tonart', 'resonans', 'melodi', 'tempo'], anchorX: 900, anchorY: 400 }
            ];
            
            peripherals.forEach((pc, pci) => {
                const numInGroup = 3 + Math.floor(Math.random() * 2);
                for (let i = 0; i < numInGroup; i++) {
                    clusters.push({
                        origX: pc.anchorX + (Math.random() - 0.5) * 180,
                        origY: pc.anchorY + (Math.random() - 0.5) * 180,
                        origZ: 300 + Math.random() * 2000,
                        hue: pc.hue + (Math.random() - 0.5) * 20,
                        radius: 40 + Math.random() * 50,
                        superCluster: 5 + pci,
                        isPeripheral: true,
                        words: Array(3 + Math.floor(Math.random() * 3)).fill(0).map(() => ({
                            dx: (Math.random() - 0.5) * 2.5,
                            dy: (Math.random() - 0.5) * 2.5,
                            txt: pc.words[Math.floor(Math.random() * pc.words.length)]
                        })),
                        pulse: 0
                    });
                }
            });

            const particles3D = [];
            const stars = [];
            for (let i = 0; i < 150; i++) {
                stars.push({
                    x: (Math.random() - 0.5) * 2000,
                    y: (Math.random() - 0.5) * 2000,
                    z: Math.random() * 2000,
                    size: 0.5 + Math.random() * 1.5,
                    opacity: 0.2 + Math.random() * 0.8
                });
            }

            let activeRay = null;
            let lastTarget = null;
            let rayWait = 0;
            let nebulaSize = 5;
            let nebulaPulse = 0;
            let nebulaHues = [];

            // Helper to draw Arrow
            function drawArrow(x1, y1, x2, y2, color, isDashed = false, arrowSize = 12) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.lineWidth = 4;
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                if (isDashed) {
                    ctx.setLineDash([8, 8]);
                }
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                ctx.restore();

                // Draw arrow head
                const angle = Math.atan2(y2 - y1, x2 - x1);
                ctx.save();
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.translate(x2, y2);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-arrowSize, -arrowSize / 2);
                ctx.lineTo(-arrowSize * 0.7, 0);
                ctx.lineTo(-arrowSize, arrowSize / 2);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

            function draw() {
                if (!document.getElementById(id)) return;
                
                const cx = w / 2;
                const cy = h / 2;
                
                // Clear or trails
                if (morfProgress > 0.1) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
                    ctx.fillRect(0, 0, w, h);
                } else {
                    ctx.clearRect(0, 0, w, h);
                }

                time += 0.01;
                
                // Linear interpolations for smooth animations
                if (currentStep >= 1) arrow1Length += (1 - arrow1Length) * 0.1;
                if (currentStep >= 2) arrow2Slide += (1 - arrow2Slide) * 0.08;
                if (currentStep >= 3) revealProgress += (1 - revealProgress) * 0.1;
                if (currentStep >= 4) morfProgress += (1 - morfProgress) * 0.05;

                // Handle explosion sparkles for Drottning reveal
                if (currentStep === 3 && !exploded) {
                    exploded = true;
                    for (let i = 0; i < 40; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 3 + Math.random() * 6;
                        explosionParticles.push({
                            x: cx + w * 0.18,
                            y: cy - h * 0.14,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            size: 2 + Math.random() * 4,
                            alpha: 1,
                            decay: 0.015 + Math.random() * 0.02
                        });
                    }
                }

                // 2D grid coordinates
                const dx = w * 0.18;
                const dy = h * 0.14;

                const gridOpacity = 1 - morfProgress;

                // DRAW 2D SYSTEM
                if (gridOpacity > 0.01) {
                    ctx.save();
                    ctx.globalAlpha = gridOpacity;

                    // 1. Grid lines (nice retro-futuristic mesh grid)
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
                    ctx.lineWidth = 1;
                    const gridSpacing = 40;
                    for (let x = cx - w * 0.45; x <= cx + w * 0.45; x += gridSpacing) {
                        ctx.beginPath();
                        ctx.moveTo(x, cy - h * 0.4);
                        ctx.lineTo(x, cy + h * 0.4);
                        ctx.stroke();
                    }
                    for (let y = cy - h * 0.4; y <= cy + h * 0.4; y += gridSpacing) {
                        ctx.beginPath();
                        ctx.moveTo(cx - w * 0.45, y);
                        ctx.lineTo(cx + w * 0.45, y);
                        ctx.stroke();
                    }

                    // 2. Axes
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                    ctx.lineWidth = 2;
                    // X Axis
                    ctx.beginPath();
                    ctx.moveTo(cx - w * 0.4, cy);
                    ctx.lineTo(cx + w * 0.4, cy);
                    ctx.stroke();
                    // Y Axis
                    ctx.beginPath();
                    ctx.moveTo(cx, cy + h * 0.35);
                    ctx.lineTo(cx, cy - h * 0.35);
                    ctx.stroke();

                    // Draw axis arrows
                    drawArrow(cx - w * 0.4, cy, cx + w * 0.41, cy, 'rgba(255, 255, 255, 0.3)', false, 8);
                    drawArrow(cx, cy + h * 0.35, cx, cy - h * 0.36, 'rgba(255, 255, 255, 0.3)', false, 8);

                    // Axis labels
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.font = "bold 13px 'JetBrains Mono', monospace";
                    ctx.textAlign = 'right';
                    ctx.fillText("Genus (Feminin ➔)", cx + w * 0.4, cy + 20);
                    ctx.textAlign = 'left';
                    ctx.fillText("Status (Kunglighet ➔)", cx + 15, cy - h * 0.33);

                    // 3. Draw nodes (words)
                    const nodes = [
                        { label: 'Man', x: cx - dx, y: cy + dy, color: '#38bdf8', visible: 1 },
                        { label: 'Kvinna', x: cx + dx, y: cy + dy, color: '#f472b6', visible: 1 },
                        { label: 'Kung', x: cx - dx, y: cy - dy, color: '#3b82f6', visible: 1 },
                        { label: 'Drottning', x: cx + dx, y: cy - dy, color: '#fbbf24', visible: revealProgress }
                    ];

                    nodes.forEach(n => {
                        if (n.visible <= 0.001) return;
                        
                        ctx.save();
                        ctx.globalAlpha = gridOpacity * n.visible;
                        
                        // Node glow radial gradient
                        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 35);
                        grad.addColorStop(0, n.color + '44');
                        grad.addColorStop(1, n.color + '00');
                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(n.x, n.y, 35, 0, Math.PI * 2);
                        ctx.fill();

                        // Solid dot
                        ctx.fillStyle = n.color;
                        ctx.shadowColor = n.color;
                        ctx.shadowBlur = 8;
                        ctx.beginPath();
                        ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        // Text label
                        ctx.fillStyle = '#ffffff';
                        ctx.font = "bold 18px 'Inter', sans-serif";
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'top';
                        ctx.fillText(n.label, n.x, n.y + 14);
                        ctx.restore();
                    });

                    // 4. Draw pulser / question mark before Drottning reveal
                    if (revealProgress < 0.99) {
                        ctx.save();
                        ctx.globalAlpha = gridOpacity * (1 - revealProgress);
                        
                        // Pulsing radius
                        const pulseScale = 1 + Math.sin(time * 6) * 0.15;
                        const pulseRad = 20 * pulseScale;
                        
                        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
                        ctx.lineWidth = 2;
                        ctx.setLineDash([4, 4]);
                        ctx.beginPath();
                        ctx.arc(cx + dx, cy - dy, pulseRad, 0, Math.PI * 2);
                        ctx.stroke();

                        ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
                        ctx.shadowColor = '#fbbf24';
                        ctx.shadowBlur = 10;
                        ctx.beginPath();
                        ctx.arc(cx + dx, cy - dy, 6, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.shadowBlur = 0;

                        ctx.fillStyle = '#ffffff';
                        ctx.font = "bold 20px 'Inter', sans-serif";
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText("?", cx + dx, cy - dy - 22);
                        ctx.restore();
                    }

                    // 5. Draw Arrows
                    // Vector 1: Man ➔ Kung
                    if (arrow1Length > 0.01) {
                        const targetY = (cy + dy) - (dy * 2) * arrow1Length;
                        drawArrow(cx - dx, cy + dy, cx - dx, targetY, 'rgba(56, 189, 248, 0.85)', false, 12);
                        
                        // Arrow Label "+ Status"
                        if (arrow1Length > 0.5) {
                            ctx.save();
                            ctx.fillStyle = '#38bdf8';
                            ctx.font = "bold 13px 'JetBrains Mono', monospace";
                            ctx.textAlign = 'right';
                            ctx.globalAlpha = gridOpacity * (arrow1Length - 0.5) * 2;
                            ctx.fillText("+ Status", cx - dx - 15, (cy + dy + targetY) / 2);
                            ctx.restore();
                        }
                    }

                    // Vector 2: Kvinna ➔ Drottning (Dasher sliding / Solid reveal)
                    if (arrow2Slide > 0.01) {
                        const slideX = -dx + (dx * 2) * arrow2Slide;
                        const opacitySlide = Math.min(1, arrow2Slide * 1.5);
                        
                        ctx.save();
                        ctx.globalAlpha = gridOpacity * opacitySlide;
                        
                        const color = arrow2Slide >= 0.98 ? 'rgba(251, 191, 36, 0.9)' : 'rgba(255, 255, 255, 0.45)';
                        const isDashed = arrow2Slide < 0.98;
                        
                        drawArrow(cx + slideX, cy + dy, cx + slideX, cy - dy, color, isDashed, 12);
                        
                        // Label "+ Status (transferred)"
                        if (arrow2Slide > 0.5) {
                            ctx.fillStyle = color;
                            ctx.font = "bold 13px 'JetBrains Mono', monospace";
                            ctx.textAlign = 'left';
                            ctx.fillText("+ Status", cx + slideX + 15, cy);
                        }
                        ctx.restore();
                    }

                    // Draw sparkles (using robust standard reverse loop to prevent slice issues)
                    for (let i = explosionParticles.length - 1; i >= 0; i--) {
                        const p = explosionParticles[i];
                        p.x += p.vx;
                        p.y += p.vy;
                        p.vx *= 0.96;
                        p.vy *= 0.96;
                        p.alpha -= p.decay;
                        
                        if (p.alpha > 0) {
                            ctx.save();
                            ctx.globalAlpha = gridOpacity * p.alpha;
                            ctx.fillStyle = '#fbbf24';
                            ctx.shadowColor = '#fbbf24';
                            ctx.shadowBlur = 6;
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.restore();
                        } else {
                            explosionParticles.splice(i, 1);
                        }
                    }

                    ctx.restore();
                }

                // DRAW 3D SYSTEM
                const camSpeed = 1.2 + time * 0.5;
                camZ += camSpeed;
                camX = Math.sin(time * 0.3) * 80;

                // Twinkling Stars
                stars.forEach(star => {
                    let sz = star.z - camZ * 0.15;
                    while (sz < 0) sz += 2000;
                    while (sz > 2000) sz -= 2000;
                    
                    const starScale = 500 / (500 + sz);
                    const sx = cx + star.x * starScale - camX * 0.3;
                    const sy = cy + star.y * starScale;
                    
                    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
                        const starOpacity = star.opacity * Math.abs(Math.sin(time * 2 + star.z)) * starScale * 0.8 * morfProgress;
                        if (starOpacity > 0.01) {
                            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, starOpacity))})`;
                            ctx.beginPath();
                            ctx.arc(sx, sy, star.size * starScale, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }
                });

                // Connecting mist connecting super-clusters
                if (morfProgress > 0.05) {
                    const fov = 500;
                    clusters.forEach((c, idx) => {
                        const angle = time * 0.12 + idx * 0.7;
                        const rx = Math.cos(angle) * c.origX - Math.sin(angle) * c.origZ * 0.3 - camX;
                        
                        let dz = c.origZ - camZ;
                        while (dz < -200) dz += 2800;
                        while (dz > 2600) dz -= 2800;
                        
                        const ry = c.origY + Math.sin(time * 0.4 + idx) * 120;
                        
                        const scale = fov / (fov + dz);
                        c.projX = cx + rx * scale;
                        c.projY = cy + ry * scale;
                        c.scale = Math.max(0, scale);
                        c.dz = dz;
                        c.visible = dz > 10;
                    });

                    // Draw connecting clouds
                    superClusters.forEach((sc, sci) => {
                        const groupClusters = clusters.filter(c => c.superCluster === sci && c.visible && c.scale > 0.15);
                        if (groupClusters.length < 2) return;
                        
                        let avgX = 0, avgY = 0, avgScale = 0;
                        groupClusters.forEach(c => { avgX += c.projX; avgY += c.projY; avgScale += c.scale; });
                        avgX /= groupClusters.length;
                        avgY /= groupClusters.length;
                        avgScale /= groupClusters.length;
                        
                        const nebRad = 200 * avgScale * morfProgress;
                        if (nebRad > 10) {
                            const nebGrad = ctx.createRadialGradient(avgX, avgY, 0, avgX, avgY, nebRad);
                            nebGrad.addColorStop(0, 'hsla(' + sc.hue + ', 60%, 40%, ' + (0.025 * avgScale * morfProgress) + ')');
                            nebGrad.addColorStop(0.6, 'hsla(' + sc.hue + ', 60%, 25%, ' + (0.012 * avgScale * morfProgress) + ')');
                            nebGrad.addColorStop(1, 'hsla(' + sc.hue + ', 60%, 10%, 0)');
                            ctx.fillStyle = nebGrad;
                            ctx.beginPath();
                            ctx.arc(avgX, avgY, nebRad, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    });

                    // Draw clusters
                    clusters.forEach(c => {
                        if (!c.visible) return;
                        c.pulse *= 0.93;
                        
                        const crad = c.radius * c.scale * morfProgress;
                        const cgrad = ctx.createRadialGradient(c.projX, c.projY, 0, c.projX, c.projY, crad);
                        cgrad.addColorStop(0, 'hsla(' + c.hue + ', 80%, 60%, ' + ((0.1 + c.pulse) * morfProgress) + ')');
                        cgrad.addColorStop(1, 'hsla(' + c.hue + ', 80%, 20%, 0)');
                        ctx.fillStyle = cgrad;
                        ctx.beginPath();
                        ctx.arc(c.projX, c.projY, crad, 0, Math.PI * 2);
                        ctx.fill();

                        // Words
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        const wordSize = Math.max(14, Math.round(20 * c.scale));
                        c.words.forEach((wObj, wi) => {
                            const wx = c.projX + Math.cos(time * 0.6 + wi * 1.3) * crad * 0.7 * wObj.dx;
                            const wy = c.projY + Math.sin(time * 0.6 + wi * 1.3) * crad * 0.7 * wObj.dy;
                            const wordAlpha = Math.min(0.85, 0.45 + c.pulse * 0.5) * Math.min(1, c.scale * 2) * morfProgress;
                            if (wordAlpha <= 0.05) return;
                            
                            ctx.save();
                            ctx.globalAlpha = wordAlpha;
                            ctx.font = `600 ${wordSize}px 'Inter', sans-serif`;
                            
                            // stroke
                            ctx.strokeStyle = 'rgba(0, 0, 0, 0.75)';
                            ctx.lineWidth = 3;
                            ctx.strokeText(wObj.txt, wx, wy);
                            
                            ctx.fillStyle = 'hsla(' + c.hue + ', 100%, ' + (80 + c.pulse * 20) + '%, 1)';
                            ctx.fillText(wObj.txt, wx, wy);
                            ctx.restore();
                        });
                    });

                    // Draw Central Nebula
                    nebulaPulse += 0.05;
                    const currentNebRadius = (nebulaSize + Math.sin(nebulaPulse) * (nebulaSize * 0.1)) * morfProgress;
                    if (nebulaHues.length > 0 && currentNebRadius > 1) {
                        const mixHue = nebulaHues[Math.floor((time * 10) % nebulaHues.length)];
                        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, currentNebRadius * 2.5);
                        grad.addColorStop(0, 'hsla(' + mixHue + ', 100%, 80%, ' + (0.9 * morfProgress) + ')');
                        grad.addColorStop(0.3, 'hsla(' + mixHue + ', 100%, 50%, ' + (0.5 * morfProgress) + ')');
                        grad.addColorStop(1, 'hsla(' + mixHue + ', 100%, 10%, 0)');
                        ctx.fillStyle = grad;
                        ctx.beginPath();
                        ctx.arc(cx, cy, currentNebRadius * 2.5, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Thread rays
                    if (!activeRay && rayWait <= 0) {
                        let nextTarget;
                        let attempts = 0;
                        const candidates = clusters.filter(c => c.visible);
                        if (candidates.length > 0) {
                            do {
                                nextTarget = candidates[Math.floor(Math.random() * candidates.length)];
                                attempts++;
                            } while (nextTarget === lastTarget && attempts < 10);
                            activeRay = {
                                target: nextTarget,
                                hue: nextTarget.hue,
                                progress: 0,
                                curveOffset: (Math.random() - 0.5) * 400
                            };
                        }
                    }
                    if (rayWait > 0) rayWait--;

                    if (activeRay) {
                        let startX = cx, startY = cy;
                        if (lastTarget) {
                            startX = lastTarget.projX;
                            startY = lastTarget.projY;
                        }
                        const endX = activeRay.target.projX;
                        const endY = activeRay.target.projY;
                        
                        activeRay.progress += 0.012;
                        
                        const t = activeRay.progress;
                        const cpx = (startX + endX) / 2 + activeRay.curveOffset;
                        const cpy = (startY + endY) / 2 - 200;
                        
                        const curX = (1-t)*(1-t)*startX + 2*(1-t)*t*cpx + t*t*endX;
                        const curY = (1-t)*(1-t)*startY + 2*(1-t)*t*cpy + t*t*endY;
                        
                        // draw laser
                        ctx.save();
                        ctx.globalAlpha = morfProgress;
                        
                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.quadraticCurveTo(cpx, cpy, curX, curY);
                        ctx.strokeStyle = `hsla(${activeRay.hue}, 100%, 65%, 0.15)`;
                        ctx.lineWidth = 7;
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(startX, startY);
                        ctx.quadraticCurveTo(cpx, cpy, curX, curY);
                        ctx.strokeStyle = `hsla(${activeRay.hue}, 100%, 85%, 0.6)`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        
                        ctx.beginPath();
                        ctx.arc(curX, curY, 4, 0, Math.PI*2);
                        ctx.fillStyle = `#ffffff`;
                        ctx.shadowColor = `hsla(${activeRay.hue}, 100%, 70%, 1)`;
                        ctx.shadowBlur = 20;
                        ctx.fill();
                        ctx.restore();
                        
                        if (activeRay.progress >= 1) {
                            activeRay.target.pulse = 1.5;
                            const harvestedWord = activeRay.target.words[Math.floor(Math.random() * activeRay.target.words.length)].txt;
                            particles3D.push({
                                startX: endX, startY: endY,
                                x: endX, y: endY,
                                hue: activeRay.hue,
                                progress: 0,
                                phase: 0,
                                phaseTimer: 0,
                                speed: 0.012 + Math.random() * 0.006,
                                word: harvestedWord,
                                curveOffset: (Math.random() - 0.5) * 300,
                                viewerX: cx * 0.35 + Math.random() * cx * 0.3,
                                viewerY: cy * 0.6 + Math.random() * cy * 0.3
                            });
                            lastTarget = activeRay.target;
                            activeRay = null;
                            rayWait = 40;
                        }
                    }

                    // 3d harvested word particles
                    for (let i = particles3D.length - 1; i >= 0; i--) {
                        const p = particles3D[i];
                        let curX, curY, fontSize, alpha, orbSize;
                        
                        if (p.phase === 0) {
                            p.progress += p.speed;
                            const t = p.progress;
                            const cpx = (p.startX + p.viewerX) / 2 + p.curveOffset * 0.5;
                            const cpy = Math.min(p.startY, p.viewerY) - 120;
                            curX = (1-t)*(1-t)*p.startX + 2*(1-t)*t*cpx + t*t*p.viewerX;
                            curY = (1-t)*(1-t)*p.startY + 2*(1-t)*t*cpy + t*t*p.viewerY;
                            fontSize = 14 + t * 34;
                            alpha = (0.4 + t * 0.6) * morfProgress;
                            orbSize = 4 + t * 8;
                            
                            if (p.progress >= 1) {
                                p.phase = 1;
                                p.phaseTimer = 0;
                                p.progress = 0;
                            }
                        } else if (p.phase === 1) {
                            p.phaseTimer++;
                            curX = p.viewerX + Math.sin(p.phaseTimer * 0.03) * 8;
                            curY = p.viewerY + Math.cos(p.phaseTimer * 0.04) * 5;
                            fontSize = 48;
                            alpha = morfProgress;
                            orbSize = 12;
                            
                            if (p.phaseTimer > 90) {
                                p.phase = 2;
                                p.progress = 0;
                                p.pauseX = curX;
                                p.pauseY = curY;
                            }
                        } else {
                            p.progress += p.speed * 0.8;
                            const t = p.progress;
                            const cpx = (p.pauseX + cx) / 2 + p.curveOffset * 0.3;
                            const cpy = (p.pauseY + cy) / 2 + 80;
                            curX = (1-t)*(1-t)*p.pauseX + 2*(1-t)*t*cpx + t*t*cx;
                            curY = (1-t)*(1-t)*p.pauseY + 2*(1-t)*t*cpy + t*t*cy;
                            fontSize = 48 * (1 - t * 0.7);
                            alpha = (1 - t) * morfProgress;
                            orbSize = 12 * (1 - t * 0.6);
                            
                            if (p.progress >= 1) {
                                nebulaSize = Math.min(nebulaSize + 3, 120);
                                if (!nebulaHues.includes(p.hue)) nebulaHues.push(p.hue);
                                particles3D.splice(i, 1);
                                continue;
                            }
                        }
                        
                        ctx.save();
                        ctx.globalAlpha = alpha;
                        
                        ctx.beginPath();
                        ctx.arc(curX, curY, orbSize * 1.8, 0, Math.PI * 2);
                        ctx.strokeStyle = `hsla(${p.hue}, 100%, 75%, 0.25)`;
                        ctx.lineWidth = 1;
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.arc(curX, curY, orbSize, 0, Math.PI*2);
                        ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, 0.85)`;
                        ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, 1)`;
                        ctx.shadowBlur = orbSize * 2.5;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                        
                        ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                        ctx.lineWidth = 4;
                        ctx.strokeText(p.word, curX, curY - orbSize - 14);
                        
                        ctx.fillStyle = `hsla(${p.hue}, 100%, 95%, 1)`;
                        ctx.fillText(p.word, curX, curY - orbSize - 14);
                        ctx.restore();
                    }
                }

                requestAnimationFrame(draw);
            }
            draw();

        }, 100);

        return `
            <div class="slide-vector-nebula no-click-advance" id="${id}">
                <div class="vn-canvas-container">
                    <canvas class="vn-canvas" id="${id}-canvas"></canvas>
                </div>
                <div class="vn-formula-badge" id="${id}-formula">
                    <span class="math-var">Kung</span> <span class="math-op">-</span> 
                    <span class="math-var">Man</span> <span class="math-op">+</span> 
                    <span class="math-var">Kvinna</span> <span class="math-op">=</span> 
                    <span class="math-var" style="color:#fbbf24; text-shadow: 0 0 15px rgba(251,191,36,0.6)">Drottning</span>
                </div>
                <div class="vn-caption-bar" id="${id}-caption"></div>
                <div class="vn-click-hint" id="${id}-hint">KLICKA FÖR ATT GÅ VIDARE</div>
            </div>
        `;
    }


    /**
     * Helper function to render the interactive source popup
     */
    function renderSourcesPopup(sources) {
        if (!sources || sources.length === 0) return '';
        let html = `
            <button class="source-toggle-btn" onclick="this.nextElementSibling.classList.toggle('active'); event.stopPropagation();">📚 Källor</button>
            <div class="source-popup" onclick="this.classList.remove('active'); event.stopPropagation();">
                <div class="source-popup-content" onclick="event.stopPropagation();">
                    <h4><span style="font-size:1.5rem">🔗</span> Verifierade Källor</h4>
                    <ul>
        `;
        sources.forEach(src => {
            html += `<li><a href="${src.url}" target="_blank" title="Öppna källan i ny flik">↗ ${src.text}</a></li>`;
        });
        html += `
                    </ul>
                    <button class="source-close-btn" onclick="this.parentElement.parentElement.classList.remove('active')">Stäng</button>
                </div>
            </div>
        `;
        return html;
    }

    // ===== MONKEY-PATCH REGISTRY =====
    /**
     * prompt-card: A large readable prompt with a copy button.
     * JSON: { type: "prompt-card", eyebrow: "Prova själv", title: "...", prompt: "...", hint: "..." }
     */
    function renderPromptCard(s) {
        const uid = 'pc-' + Math.random().toString(36).slice(2, 8);
        const promptText = s.prompt || '';
        
        // Inject copy logic after render
        setTimeout(() => {
            const btn = document.getElementById(uid + '-btn');
            if (!btn) return;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(promptText).then(() => {
                    btn.innerHTML = '✅ Kopierat!';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.innerHTML = '📋 Kopiera prompt';
                        btn.classList.remove('copied');
                    }, 2500);
                }).catch(() => {
                    // Fallback for non-HTTPS/restricted environments
                    const ta = document.createElement('textarea');
                    ta.value = promptText;
                    ta.style.position = 'fixed'; ta.style.opacity = '0';
                    document.body.appendChild(ta);
                    ta.select(); document.execCommand('copy');
                    document.body.removeChild(ta);
                    btn.innerHTML = '✅ Kopierat!';
                    btn.classList.add('copied');
                    setTimeout(() => { btn.innerHTML = '📋 Kopiera prompt'; btn.classList.remove('copied'); }, 2500);
                });
            });
        }, 100);

        return `
            <div class="slide-prompt-card no-click-advance" style="position: relative;">
                ${s.eyebrow ? `<div class="pc-eyebrow">${s.eyebrow}</div>` : ''}
                <div class="pc-title">${s.title || ''}</div>
                <div class="pc-box">
                    <button class="pc-copy-btn" id="${uid}-btn">📋 Kopiera prompt</button>
                    <div class="pc-prompt">${promptText}</div>
                </div>
                ${s.hint ? `<div class="pc-hint">💡 ${s.hint}</div>` : ''}
                ${renderSourcesPopup(s.sources)}
            </div>
        `;
    }
    
    /**
     * milestone-reveal: Interactive date reveal button
     */
    function renderMilestoneReveal(s) {
        const uid = 'ms-' + Math.random().toString(36).slice(2,8);
        setTimeout(() => {
            const btn = document.getElementById(uid);
            if(btn) {
                btn.onclick = (e) => {
                    e.stopPropagation(); // prevent slide advance
                    btn.classList.add('revealed');
                };
            }
        }, 100);

        let html = `<div class="slide-milestone">`;
        html += `<button id="${uid}" class="ms-date-btn">${s.date}</button>`;
        html += `<div class="ms-content">`;
        if (s.eyebrow) html += `<div class="ms-eyebrow">${s.eyebrow}</div>`;
        if (s.title) html += `<div class="ms-title">${s.title}</div>`;
        if (s.features) {
            html += `<div class="ms-features">`;
            s.features.forEach(f => {
                html += `<div class="ms-feature">${f}</div>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
        html += renderSourcesPopup(s.sources);
        html += `</div>`;
        return html;
    }
    // --- CHAOS TO CLARITY (v2 — Interactive Popup Edition) ---
    function renderChaosToClarity(slide) {
        const allScenarios = [
            { id: 'krankning', icon: '🏫', role: 'Rektor', label: '[23:14] Föräldramejl:', text: '"Det här är helt oacceptabelt!! Ni har inte lyssnat på ett ord jag sagt om rasterna..."', summary: 'Konfliktmönster identifierat under raster (vecka 19\u201320). Eskalerande föräldrakontakt.', law: '6 kap. Skollagen \u2014 skyndsamhetskrav (10§). Anmälningsplikt till huvudman.', action: 'Professionellt svarsmejl till vårdnadshavare + formellt utkast till kränkningsutredning.', time: '90 min', redirect: 'Lektionsobservation', srcText: 'Skollagen 6 kap. 10§ · SOU 2026:4', srcUrl: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/skollag-2010800_sfs-2010-800/', tip: 'Använd AI för att generera ett professionellt svarsutkast baserat på skolans policy. Be den identifiera vilken paragraf som är tillämplig och föreslå en tidsplan för utredningen. Granska alltid utkastet innan du skickar.' },
            { id: 'eht', icon: '🏫', role: 'Rektor', label: '[EHT-anteckning]:', text: 'Eleven orolig. Åtgärd? Måste kolla kap 3. Kanske anpassad studiegång? Vem gör vad?', summary: 'EHT-ärendet saknar tydlig åtgärdsplan. Tre möjliga spår identifierade.', law: 'Skollagen 3 kap (Särskilt stöd) \u2014 utredningsplikt. Skillnad extra anpassning vs. särskilt stöd.', action: 'Strukturerad åtgärdsplan med roller, tidsaxel och uppföljningsdatum.', time: '60 min', redirect: 'Samtal med lärarlaget', srcText: 'Skollagen 3 kap · Skolverket', srcUrl: 'https://www.skolverket.se', tip: 'Mata in anonymiserad ärendehistorik och be AI strukturera en åtgärdsplan med kolumner: Vem/Vad/När/Uppföljning. Viktigt: inga personuppgifter i prompten \u2014 använd "Elev X".' },
            { id: 'vikarie', icon: '👶', role: 'Förskolechef', label: '[07:02] SMS:', text: 'Tre VAB idag. Avd. Nyckelpigan utan personal. Stänga eller slå ihop?', summary: 'Akut personalbrist (3 VAB). Barngruppsstorlek överskrider riktmärke vid ihopslagning.', law: 'Skolverkets riktmärken: max 12 barn (1\u20133 år), max 15 (4\u20135 år). Arbetsmiljölagen.', action: 'Tre alternativ med konsekvensanalys + föräldrakommunikation (SMS-utkast till 25 familjer).', time: '45 min', redirect: 'Pedagogisk handledning', srcText: 'Skolverket: Riktmärken barngrupper', srcUrl: 'https://www.skolverket.se', tip: 'Skapa en promptmall: "Vi har X personal och Y barn. Ge 3 alternativ med för-/nackdelar." Spara bästa utkastet som SMS-mall i telefonens anteckningar för snabb återanvändning.' },
            { id: 'ska', icon: '🏛️', role: 'Förvaltningschef', label: '[Deadline fredag]:', text: 'SKA-rapporten till nämnden. 14 rektorer har lämnat in. 6 saknas. Sammandrag?', summary: 'Systematiskt kvalitetsarbete: 14/20 enheter rapporterade. Gap-analys med 3 trender.', law: 'Skollagen 4 kap. Huvudmannens uppföljningsansvar. SOU 2026:4 föreslår utökad SKA.', action: 'Aggregerad analys av 14 rapporter med tematiska trender och nämndspresentation.', time: '3 timmar', redirect: 'Rektorscoachning', srcText: 'Skollagen 4 kap · Skolverket SKA', srcUrl: 'https://www.skolverket.se', tip: 'Ladda upp alla 14 rapporter (anonymiserade) till Claude och be om: (1) gemensamma teman, (2) avvikelser, (3) förslag till nämndspresentation i 5 punkter. Spara prompten som återanvändbar mall inför varje SKA-cykel.' },
            { id: 'delegering', icon: '🏫', role: 'Bitr. rektor', label: '[Mejl: Delegering]:', text: '"Kan du ta schemaomläggningen, medarbetarsamtalen OCH rastvakterna? Jag har nämndsmöte."', summary: 'Tre parallella uppdrag utan mandat eller prioriteringsordning. Risk för kvalitetsbrister.', law: 'AFS 2015:4 (Org. arbetsmiljö): krav på tydliga befogenheter vid delegation.', action: 'Prioriteringsmatris med tidsuppskattning + förslag på delegationsdokument.', time: '75 min', redirect: 'Klassrumsnärvaro', srcText: 'Arbetsmiljöverket: AFS 2015:4', srcUrl: 'https://www.av.se', tip: 'Be AI skapa en Eisenhower-matris med dina tre uppdrag. Formulera sedan ett kort mejlsvar till rektor med förslag på prioritering och tydlig fråga: "Vilken uppgift har företräde om tiden inte räcker?"' },
            { id: 'medarb', icon: '🏫', role: 'Rektor', label: '[Lönerevisionen]:', text: '42 medarbetarsamtal. 60-90 min/st. Lönekriterier, dokumentation. Allt före 15 april.', summary: 'Uppskattad total tidsåtgång: ~80h (samtal + för-/efterarbete). 3 veckor effektiv arbetstid.', law: 'Kollektivavtal (HÖK/ÖLA). Lönesättande samtal kräver dokumenterat underlag.', action: 'Individuella förberedelsepromemoria per medarbetare baserat på fjolårets mål och resultat.', time: '2 timmar/dag', redirect: 'Undervisningsbesök', srcText: 'Sveriges Skolledare: Löneprocessen', srcUrl: 'https://www.skolledaren.se/', tip: 'Skapa en prompt per medarbetare: "Baserat på dessa mål [X] och dessa resultat [Y], föreslå 3 samtalsöppnare och 2 utvecklingsområden." Generera alla 42 på en eftermiddag istället för att börja från blankt papper varje gång.' },
            { id: 'peddok', icon: '👶', role: 'Förskolechef', label: '[Pedagogisk dok.]:', text: 'Avd. Ekorren har inte hunnit dokumentera Lpfö-målen på 3 veckor. Skolverket vill ha SKA-underlag.', summary: 'Dokumentationseftersläpning på 2 av 4 avdelningar. Avsaknad av strukturerad analysrutin.', law: 'Lpfö 18: Rektorns ansvar att systematiskt följa upp. Skollagen 4 kap.', action: 'Mall för veckovis reflektion (15 min/arbetslag) + SKA-sammandrag genererat från anteckningar.', time: '50 min', redirect: 'Kollegial handledning', srcText: 'Skolverket: Lpfö 18', srcUrl: 'https://www.skolverket.se/undervisning/forskolan/laroplan-for-forskolan', tip: 'Inför "5-minuters-prompten": Pedagogerna skriver 3 meningar om dagens aktivitet. AI omvandlar till strukturerad Lpfö-koppling. Sänker tröskeln dramatiskt \u2014 från 30 min dokumentation till 5 min input.' },
            { id: 'budget', icon: '🏫', role: 'Rektor', label: '[Budget -8%]:', text: 'Elevtapp: 23 elever. Skolpengen minskar 1.8 Mkr. Vad skär vi i? Elevhälsa? Läromedel? Tjänster?', summary: 'Skolkostymen oförändrad trots 8% intäktsminskning. 3 scenarier med olika konsekvenskedjor.', law: 'Skollagen 2 kap 8a§: Rektors ansvar för inre organisation. Kommunens utbudsansvar.', action: 'Konsekvensanalys per scenario + dokumenterat underlag till huvudman om kvalitetsrisker.', time: '4 timmar', redirect: 'Pedagogisk utvecklingsdag', srcText: 'Riksrevisionen: Skolpengens effekter', srcUrl: 'https://www.riksrevisionen.se/', tip: 'Be AI generera 3 nedskärningsscenarier med konsekvenskedja: "Om vi skär X → påverkas Y → risk för Z." Använd detta som underlag i dialogen med förvaltningen \u2014 det synliggör konsekvenser innan beslut tas.' },
            { id: 'rekrytering', icon: '🏛️', role: 'Skolchef', label: '[Rekryteringsläget]:', text: 'Ma/NO-lärare: 3 sökande (0 behöriga). 4 skolor behöver. Löneläge? Alternativa vägar?', summary: 'Strukturell lärarbrist: nationell prognos visar underskott till 2035. Lokalt: 67% behörighet.', law: 'Skollagen 2 kap 13§: krav på legitimerade lärare. Undantag max 1 år utan legitimation.', action: 'Kompetensförsörjningsplan med 3 spår: rekrytering, VFU-samverkan, behörighetsutbildning.', time: '2 timmar', redirect: 'Rektorsnätverksträff', srcText: 'Skolverket: Lärarprognos 2024', srcUrl: 'https://www.skolverket.se', tip: 'Använd AI för att skriva attraktiva platsannonser anpassade för Ma/NO-lärare. Be den analysera konkurrentkommuners annonser och identifiera vad som saknas i era. Testa A/B-varianter.' },
            { id: 'incident', icon: '🏫', role: 'Rektor', label: '[Incidentrapport]:', text: 'Hot mot personal i tamburen. Förälder vägrar lämna. Polis tillkallad. Vad säger lagen? Vem informeras?', summary: 'Säkerhetsincident med extern aktör. Arbetsmiljöansvar + orosanmälan + personalstöd parallellt.', law: 'AML 3 kap 2§: arbetsgivarens utredningsskyldighet. Socialtjänstlagen 14 kap 1§ vid oro.', action: 'Incidentprotokoll + kommunikationsplan (personal, föräldrar, huvudman) + anmälan Arbetsmiljöverket.', time: '2 timmar', redirect: 'Trygghetsarbete med eleverna', srcText: 'Arbetsmiljöverket: Hot och våld', srcUrl: 'https://www.av.se', tip: 'Ha en färdig promptmall för krislägen: "Incident: [typ]. Berörd personal: [antal]. Generera: (1) internt protokoll, (2) mejl till huvudman, (3) information till övrig personal." Tiden du sparar är kritisk i akutläget.' }
        ];
        // Show 5 per sub-slide, mixed roles. positions are assigned dynamically.
        const positions = [
            'top:8%;left:4%;transform:rotate(-5deg)',
            'top:16%;right:7%;transform:rotate(6deg)',
            'bottom:14%;left:10%;transform:rotate(3deg)',
            'bottom:24%;right:5%;transform:rotate(-6deg)',
            'top:40%;left:30%;transform:rotate(2deg)'
        ];
        const pageSize = 5;
        const totalPages = Math.ceil(allScenarios.length / pageSize);
        let currentPage = 0;
        const uid = 'cc2-' + Math.random().toString(36).slice(2,8);

        function buildCards(page) {
            const start = page * pageSize;
            const items = allScenarios.slice(start, start + pageSize);
            let h = '';
            items.forEach((s,i) => {
                h += `<div class="cc2-card" data-idx="${start + i}" style="${positions[i]}">`;
                h += `<span class="cc2-card-role">${s.icon} ${s.role}</span>`;
                h += `<strong>${s.label}</strong><br/>${s.text}</div>`;
            });
            return h;
        }

        let html = `
                <style>
            .slide-gdpr-mindmap { width:100%; min-height:75cqh; display:flex; align-items:center; justify-content:center; padding:1rem; }
            .gm-container { width:100%; max-width:1400px; font-family: var(--font-body, system-ui); display: flex; justify-content: center; }
            
            /* Horizontal Tree Structure */
            .gm-node { display: flex; flex-direction: row; align-items: center; position: relative; margin: 0.2rem 0; }
            .gm-label { z-index: 2; position: relative; max-width: 280px; }
            
            .gm-root { flex-direction: row; }
            .gm-root > .gm-label { font-size:clamp(1.1rem, 4cqmin, 1.8rem); color:var(--accent); font-weight:700; padding:1rem 1.5rem; border:2px solid rgba(249,115,22,0.4); cursor:default; background: rgba(30,27,75,0.9); border-radius: 12px; box-shadow: 0 0 20px rgba(249,115,22,0.2); display: inline-flex; align-items: center; gap: 0.5rem; text-align: center; justify-content: center; margin-right: 2rem; }
            
            .gm-children { display: flex; flex-direction: column; justify-content: center; position: relative; padding-left: 2rem; overflow: hidden; max-width: 0; opacity: 0; transition: max-width 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease; }
            .gm-node.open > .gm-children { max-width: 1000px; opacity: 1; }
            .gm-root > .gm-children { max-width: none; opacity: 1; padding-left: 0; }
            
            /* Connectors */
            .gm-children::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 2px; height: calc(100% - 3rem); background: rgba(255,255,255,0.15); border-radius: 2px; }
            .gm-node:not(.gm-root)::before { content: ''; position: absolute; left: -2rem; top: 50%; width: 2rem; height: 2px; background: rgba(255,255,255,0.15); }
            .gm-root > .gm-children::before { display: none; }
            
            .gm-branch > .gm-label { font-size:clamp(0.85rem, 2.5cqmin, 1.1rem); color:rgba(255,255,255,0.9); font-weight:600; padding:0.6rem 1rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer; transition:all 0.25s ease; display:flex; align-items:center; gap:0.5rem; margin-right: 2rem; }
            .gm-branch > .gm-label:hover { background:rgba(249,115,22,0.1); border-color:rgba(249,115,22,0.4); transform: scale(1.02); }
            .gm-branch.open > .gm-label { border-color:var(--accent); background:rgba(249,115,22,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            
            .gm-leaf { flex-direction: column; align-items: flex-start; }
            .gm-leaf > .gm-label { font-size:clamp(0.75rem, 2cqmin, 0.95rem); color:rgba(255,255,255,0.8); padding:0.4rem 0.8rem; background:transparent; border:1px solid transparent; cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; gap:0.4rem; }
            .gm-leaf > .gm-label:hover { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.3); }
            .gm-leaf.open > .gm-label { color: #fff; font-weight: bold; }
            
            .gm-icon { font-size:1.2em; }
            .gm-toggle { margin-left:auto; font-size:0.8em; color:rgba(255,255,255,0.4); transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .gm-node.open > .gm-label .gm-toggle { transform:rotate(90deg); color:var(--accent); }
            
            .gm-detail { max-height:0; overflow:hidden; opacity:0; transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1); color:rgba(255,255,255,0.6); font-size:clamp(0.7rem, 1.8cqmin, 0.85rem); line-height:1.5; padding-left: 1.8rem; max-width: 350px; }
            .gm-leaf.open > .gm-detail { max-height:150px; opacity:1; padding-top: 0.2rem; padding-bottom: 0.5rem; }
        </style>
        <div class="slide-gdpr-mindmap component no-click-advance" id="${uid}">
            <div class="gm-container">${renderNode(tree, 0)}</div>
        </div>`;
        setTimeout(() => {
            const root = document.getElementById(uid);
            if (!root) return;
            root.querySelectorAll('.gm-label').forEach(label => {
                label.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const node = label.parentElement;
                    if (node.classList.contains('gm-root')) return;
                    node.classList.toggle('open');
                });
            });
            root.querySelector('.gm-container').addEventListener('click', (e) => {
                if (!e.target.closest('.gm-label')) { root.classList.remove('no-click-advance'); }
            });
        }, 150);
        return html;
    }


    // --- CHEFSPERSPEKTIV PÅ AI MINDMAP ---
    function renderLeadershipMindmap(slide) {
        const tree = {
            label: 'Chefsperspektiv på Generativ AI', icon: '🎯', children: [
                { label: 'Administrativ avlastning', icon: '⏱️', children: [
                    { label: '60–80% admin → kärnuppdrag', detail: 'Globala studier visar att rektorer lägger 60–80% på admin. AI kan halvera detta och frigöra tid för pedagogiskt ledarskap.' },
                    { label: 'Kommunikation & dokumentation', detail: 'Utkast till föräldrabrev, mötesprotokoll, policytexter, nyhetsbrev. Sänker tröskeln från 45 min till 10 min per uppgift.' },
                    { label: 'Dataanalys & uppföljning', detail: 'Sammanställning av resultat, frånvaromönster, SKA-underlag. AI identifierar trender du annars missar.' }
                ]},
                { label: 'Etik & beslutsfattande', icon: '⚖️', children: [
                    { label: 'AI som "tankepartner"', detail: 'UNESCO & OECD: AI ska vara en "thought partner", aldrig en beslutsfattare. Human-in-the-loop är lag (EU AI Act Art. 14).' },
                    { label: 'Algoritmisk bias', detail: 'AI-verktyg kan förstärka befintliga ojämlikheter. Chefen måste kvalitetssäkra att verktyg inte diskriminerar elever/personal.' },
                    { label: 'Transparens mot föräldrar', detail: 'Ökande krav på att redovisa NÄR och HUR AI används i skolverksamheten. Förtroende kräver öppenhet.' }
                ]},
                { label: 'Kompetensutveckling', icon: '📚', children: [
                    { label: 'UNESCO: 15 lärarkompetenser', detail: 'AI Competency Framework for Teachers (2024): Etik, grundläggande AI, AI-pedagogik, professionellt lärande med AI.' },
                    { label: 'Sveriges Skolledare: akut behov', detail: 'Majoritet av skolledare saknar utbildning. Kräver nationellt stöd — skolan exkluderad från AI-kommissionens strategi.' },
                    { label: 'OECD: "AI-litteracitet"', detail: '4 domäner: Engage with AI, Create with AI, Manage AI, Design AI. Förbereds som del av PISA-ramverket.' }
                ]},
                { label: 'Policy & styrning', icon: '📋', children: [
                    { label: 'Nationellt styrningsglapp (SE)', detail: 'Sverige saknar nationell AI-strategi för skolan. SKR + Ifous ger lokalt stöd, men rektorer navigerar i dimma.' },
                    { label: 'Kontrollerad vs okontrollerad', detail: 'Frågan är inte "AI eller ej" utan "loggad, styrd användning" kontra "osynlig, oreglerad". Chefen sätter tonen.' },
                    { label: 'PUB-avtal & upphandling', detail: 'Huvudmannen MÅSTE ha personuppgiftsbiträdesavtal med AI-leverantörer. Gratis = ingen garanti.' }
                ]},
                { label: 'Internationella ramverk', icon: '🌍', children: [
                    { label: 'UNESCO FutureProof Education', detail: 'Lanserat sept 2025 med EU. Stöd till skolmyndigheter i 6 länder. Praktiska verktyg för AI-integration på skolnivå.' },
                    { label: 'OECD Empowering Leaders Toolkit', detail: '3 moduler: Riskminimering, Strategisk integration, Möjlighetsmaximering. Uppdaterad dec 2025.' },
                    { label: 'EU AI Act (stegvis 2025–2027)', detail: 'Högrisk-klassning möjlig för AI i utbildning. Kräver FRIA + dokumentation + mänsklig kontroll. Gäller dig som chef.' }
                ]}
            ]
        };
        const uid = 'lm-' + Math.random().toString(36).slice(2,8);
        function renderNode(node, depth) {
            const hasKids = node.children && node.children.length;
            const cls = depth === 0 ? 'gm-root' : (hasKids ? 'gm-branch' : 'gm-leaf');
            let h = '<div class="gm-node '+cls+'" data-depth="'+depth+'">';
            h += '<div class="gm-label" tabindex="0">';
            if (node.icon) h += '<span class="gm-icon">'+node.icon+'</span>';
            h += '<span class="gm-text">'+node.label+'</span>';
            if (hasKids) h += '<span class="gm-toggle">\u25b8</span>';
            h += '</div>';
            if (node.detail) h += '<div class="gm-detail">'+node.detail+'</div>';
            if (hasKids) {
                h += '<div class="gm-children">';
                node.children.forEach(c => { h += renderNode(c, depth+1); });
                h += '</div>';
            }
            h += '</div>';
            return h;
        }
        let html = `
                <style>
            .slide-gdpr-mindmap { width:100%; min-height:75cqh; display:flex; align-items:center; justify-content:center; padding:1rem; }
            .gm-container { width:100%; max-width:1400px; font-family: var(--font-body, system-ui); display: flex; justify-content: center; }
            
            /* Horizontal Tree Structure */
            .gm-node { display: flex; flex-direction: row; align-items: center; position: relative; margin: 0.2rem 0; }
            .gm-label { z-index: 2; position: relative; max-width: 280px; }
            
            .gm-root { flex-direction: row; }
            .gm-root > .gm-label { font-size:clamp(1.1rem, 4cqmin, 1.8rem); color:var(--accent); font-weight:700; padding:1rem 1.5rem; border:2px solid rgba(249,115,22,0.4); cursor:default; background: rgba(30,27,75,0.9); border-radius: 12px; box-shadow: 0 0 20px rgba(249,115,22,0.2); display: inline-flex; align-items: center; gap: 0.5rem; text-align: center; justify-content: center; margin-right: 2rem; }
            
            .gm-children { display: flex; flex-direction: column; justify-content: center; position: relative; padding-left: 2rem; overflow: hidden; max-width: 0; opacity: 0; transition: max-width 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease; }
            .gm-node.open > .gm-children { max-width: 1000px; opacity: 1; }
            .gm-root > .gm-children { max-width: none; opacity: 1; padding-left: 0; }
            
            /* Connectors */
            .gm-children::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 2px; height: calc(100% - 3rem); background: rgba(255,255,255,0.15); border-radius: 2px; }
            .gm-node:not(.gm-root)::before { content: ''; position: absolute; left: -2rem; top: 50%; width: 2rem; height: 2px; background: rgba(255,255,255,0.15); }
            .gm-root > .gm-children::before { display: none; }
            
            .gm-branch > .gm-label { font-size:clamp(0.85rem, 2.5cqmin, 1.1rem); color:rgba(255,255,255,0.9); font-weight:600; padding:0.6rem 1rem; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; cursor:pointer; transition:all 0.25s ease; display:flex; align-items:center; gap:0.5rem; margin-right: 2rem; }
            .gm-branch > .gm-label:hover { background:rgba(249,115,22,0.1); border-color:rgba(249,115,22,0.4); transform: scale(1.02); }
            .gm-branch.open > .gm-label { border-color:var(--accent); background:rgba(249,115,22,0.15); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
            
            .gm-leaf { flex-direction: column; align-items: flex-start; }
            .gm-leaf > .gm-label { font-size:clamp(0.75rem, 2cqmin, 0.95rem); color:rgba(255,255,255,0.8); padding:0.4rem 0.8rem; background:transparent; border:1px solid transparent; cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; gap:0.4rem; }
            .gm-leaf > .gm-label:hover { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.3); }
            .gm-leaf.open > .gm-label { color: #fff; font-weight: bold; }
            
            .gm-icon { font-size:1.2em; }
            .gm-toggle { margin-left:auto; font-size:0.8em; color:rgba(255,255,255,0.4); transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .gm-node.open > .gm-label .gm-toggle { transform:rotate(90deg); color:var(--accent); }
            
            .gm-detail { max-height:0; overflow:hidden; opacity:0; transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1); color:rgba(255,255,255,0.6); font-size:clamp(0.7rem, 1.8cqmin, 0.85rem); line-height:1.5; padding-left: 1.8rem; max-width: 350px; }
            .gm-leaf.open > .gm-detail { max-height:150px; opacity:1; padding-top: 0.2rem; padding-bottom: 0.5rem; }
        </style>
        <div class="slide-gdpr-mindmap component no-click-advance" id="${uid}">
            <div class="gm-container">${renderNode(tree, 0)}</div>
        </div>`;
        setTimeout(() => {
            const root = document.getElementById(uid);
            if (!root) return;
            root.querySelectorAll('.gm-label').forEach(label => {
                label.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const node = label.parentElement;
                    if (node.classList.contains('gm-root')) return;
                    node.classList.toggle('open');
                });
            });
            root.querySelector('.gm-container').addEventListener('click', (e) => {
                if (!e.target.closest('.gm-label')) { root.classList.remove('no-click-advance'); }
            });
        }, 150);
        return html;
    }

    // --- DUAL ANALYSIS METHOD PROMPT ---
    function renderDualAnalysisPrompt(slide) {
        const uid = 'dap-' + Math.random().toString(36).slice(2,8);
        const promptText = `Du är en expert på textanalys och retorik. Mitt mål är att skapa ett "Personligt skrivregelsdokument" så att du framöver kan generera utkast som låter precis som jag. Vi ska använda The Dual Analysis Method.

Steg 1: Ställ 3-4 korta frågor till mig om hur jag föredrar att kommunicera (min uttalade stil). Vänta på mitt svar.

Steg 2: När jag har svarat ska du göra en djuplodande analys av *hur* jag faktiskt skrev mitt svar (observerad stil). Analysera meningslängd, ordval, struktur, ton och skiljetecken (t.ex. om jag använder tankstreck eller utropstecken).

Steg 3: Baserat på både vad jag sade OCH hur jag skrev, ge mig en färdig, punktad lista med "Custom Instructions" som jag kan spara och använda framöver för att få dig att skriva i min röst.`;

        let html = `
        <style>
            .slide-dual-analysis { width:100%; min-height:75cqh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:clamp(2rem,4cqw,4rem); font-family:var(--font-body, system-ui); text-align:center; }
            .da-typewriter-container { height: 4rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: center; }
            .da-typewriter { font-size:clamp(2.5rem,4cqw,3.5rem); font-weight:800; font-family:var(--font-mono, monospace); color:var(--accent); border-right: 4px solid var(--accent); white-space: nowrap; overflow: hidden; width: 0; }
            .da-typewriter.start { animation: typing 2.5s steps(30, end) forwards, blink-caret .75s step-end infinite; }
            @keyframes typing { from { width: 0 } to { width: 100% } }
            @keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: var(--accent); } }
            
            .da-explanation { opacity:0; transform:translateY(20px); font-size:clamp(1.1rem, 1.8cqw, 1.4rem); color:rgba(255,255,255,0.8); max-width:800px; line-height:1.6; margin-bottom: 3rem; transition: all 0.5s ease; }
            .da-explanation.visible { opacity:1; transform:translateY(0); }
            
            .da-method-box { display:flex; gap: 2rem; margin-bottom: 3rem; }
            .da-step { opacity:0; transform:translateY(20px); transition: all 0.5s ease; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; width: 280px; text-align: left; position: relative; }
            .da-step.visible { opacity:1; transform:translateY(0); }
            .da-step-num { position:absolute; top:-15px; left:-15px; background:var(--accent); color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:1.2rem; }
            .da-step h3 { margin:0 0 0.5rem 0; color:#fff; font-size:1.2rem; }
            .da-step p { margin:0; color:rgba(255,255,255,0.6); font-size:0.95rem; line-height:1.5; }
            
            .da-action-btn { opacity:0; transform:translateY(20px); transition: all 0.5s ease; background: var(--accent); color: #fff; border: none; padding: 1rem 2rem; font-size: 1.2rem; font-weight: bold; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; box-shadow: 0 4px 15px rgba(249,115,22,0.3); }
            .da-action-btn.visible { opacity:1; transform:translateY(0); }
            .da-action-btn:hover { background: #ea580c; transform: translateY(-2px) !important; box-shadow: 0 6px 20px rgba(249,115,22,0.4); }
            
            /* Modal */
            .da-modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:9999; display:flex; align-items:center; justify-content:center; opacity:0; pointer-events:none; transition:opacity 0.3s; }
            .da-modal-overlay.open { opacity:1; pointer-events:auto; }
            .da-modal-content { background:#111; border:1px solid rgba(255,255,255,0.1); border-radius:16px; width:90%; max-width:800px; padding:2rem; position:relative; transform:scale(0.95); transition:transform 0.3s; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
            .da-modal-overlay.open .da-modal-content { transform:scale(1); }
            .da-close-btn { position:absolute; top:1.5rem; right:1.5rem; background:none; border:none; color:rgba(255,255,255,0.5); font-size:2rem; cursor:pointer; line-height:1; }
            .da-close-btn:hover { color:#fff; }
            .da-modal-title { font-size:1.5rem; color:#fff; margin:0 0 1.5rem 0; display:flex; align-items:center; gap:0.8rem; }
            .da-prompt-box { background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:1.5rem; font-family:var(--font-mono, monospace); font-size:1rem; color:rgba(255,255,255,0.8); line-height:1.6; white-space:pre-wrap; margin-bottom:1.5rem; text-align: left; }
            
            .da-modal-actions { display:flex; gap:1rem; justify-content:flex-end; }
            .da-copy-btn { background:rgba(255,255,255,0.1); color:#fff; border:none; padding:0.8rem 1.5rem; font-size:1rem; font-weight:bold; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:0.5rem; transition:background 0.2s; }
            .da-copy-btn:hover { background:rgba(255,255,255,0.2); }
            .da-copy-btn.success { background: #10b981; color: #fff; }
        </style>
        
        <div class="slide-dual-analysis component no-click-advance" id="${uid}">
            <div class="da-typewriter-container">
                <div class="da-typewriter" id="${uid}-tw">Kan AI skriva som du?</div>
            </div>
            
            <div class="da-explanation" id="${uid}-exp">
                <strong>Spara tid från dag ett.</strong><br>
                Många chefer fastnar i att ständigt behöva redigera AI:ns byråkratiska utkast. 
                Genom att skapa en <em>personlig stilguide</em> kan du styra AI:n till att låta som dig direkt. 
                Vi använder en teknik där AI:n inte bara lyssnar på vad du säger, utan även analyserar <em>hur</em> du säger det.
            </div>
            
            <div class="da-method-box" id="${uid}-box">
                <div class="da-step" id="${uid}-s1">
                    <div class="da-step-num">1</div>
                    <h3>Intervju</h3>
                    <p>AI:n ställer frågor om hur du föredrar att kommunicera (din uttalade stil).</p>
                </div>
                <div class="da-step" id="${uid}-s2">
                    <div class="da-step-num">2</div>
                    <h3>Analys</h3>
                    <p>AI:n analyserar din faktiska meningslängd, rytm och dina skiljetecken (din observerade stil).</p>
                </div>
                <div class="da-step" id="${uid}-s3">
                    <div class="da-step-num">3</div>
                    <h3>Stilguide</h3>
                    <p>Du får ett färdigt skrivregelsdokument (System Prompt) att klistra in i din profil.</p>
                </div>
            </div>
            
            <button class="da-action-btn" id="${uid}-open"><span>💬</span> Visa Intervju-prompten</button>
        </div>
        
        <div class="da-modal-overlay" id="${uid}-modal">
            <div class="da-modal-content">
                <button class="da-close-btn" id="${uid}-close">×</button>
                <h2 class="da-modal-title"><span>📝</span> Dual Analysis Prompt</h2>
                <div class="da-prompt-box" id="${uid}-text">${promptText}</div>
                <div class="da-modal-actions">
                    <button class="da-copy-btn" id="${uid}-copy">📋 Kopiera till urklipp</button>
                </div>
            </div>
        </div>
        `;

        setTimeout(() => {
            const tw = document.getElementById(uid + '-tw');
            const exp = document.getElementById(uid + '-exp');
            const s1 = document.getElementById(uid + '-s1');
            const s2 = document.getElementById(uid + '-s2');
            const s3 = document.getElementById(uid + '-s3');
            const btnOpen = document.getElementById(uid + '-open');
            const modal = document.getElementById(uid + '-modal');
            const btnClose = document.getElementById(uid + '-close');
            const btnCopy = document.getElementById(uid + '-copy');
            const promptEl = document.getElementById(uid + '-text');
            const slideContainer = document.getElementById(uid);

            // Auto-start typewriter
            setTimeout(() => { if (tw) tw.classList.add('start'); }, 500);

            // Click-based progression
            const steps = [
                () => { if (exp) exp.classList.add('visible'); },
                () => { if (s1) s1.classList.add('visible'); },
                () => { if (s2) s2.classList.add('visible'); },
                () => { if (s3) s3.classList.add('visible'); },
                () => { 
                    if (btnOpen) btnOpen.classList.add('visible'); 
                    if (slideContainer) slideContainer.classList.remove('no-click-advance'); 
                }
            ];

            let currentStep = 0;
            if (slideContainer) {
                slideContainer.addEventListener('click', (e) => {
                    // Do not advance if clicking inside the modal or on the button
                    if (e.target.closest('.da-action-btn') || e.target.closest('.da-modal-content')) return;
                    
                    if (currentStep < steps.length) {
                        e.stopPropagation();
                        steps[currentStep]();
                        currentStep++;
                    }
                });
            }

            // Modal logic
            if (btnOpen) btnOpen.addEventListener('click', (e) => { e.stopPropagation(); modal.classList.add('open'); });
            if (btnClose) btnClose.addEventListener('click', (e) => { e.stopPropagation(); modal.classList.remove('open'); });
            if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) { e.stopPropagation(); modal.classList.remove('open'); } });

            // Copy logic
            if (btnCopy && promptEl) {
                btnCopy.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const txt = promptEl.textContent || promptEl.innerText;
                    navigator.clipboard.writeText(txt).then(() => {
                        btnCopy.innerHTML = '✅ Kopierat!';
                        btnCopy.classList.add('success');
                        setTimeout(() => { btnCopy.innerHTML = '📋 Kopiera till urklipp'; btnCopy.classList.remove('success'); }, 2500);
                    }).catch(() => {
                        const ta = document.createElement('textarea');
                        ta.value = txt;
                        ta.style.position = 'fixed'; ta.style.opacity = '0';
                        document.body.appendChild(ta);
                        ta.select(); document.execCommand('copy');
                        document.body.removeChild(ta);
                        btnCopy.innerHTML = '✅ Kopierat!';
                        btnCopy.classList.add('success');
                        setTimeout(() => { btnCopy.innerHTML = '📋 Kopiera till urklipp'; btnCopy.classList.remove('success'); }, 2500);
                    });
                });
            }
        }, 150);

        return html;
    }

    function renderTitleAstorp(s) {
        const id = 'ta-container-' + Math.random().toString(36).slice(2, 8);
        
        // Initialize the canvas animation after element is rendered in DOM
        setTimeout(() => {
            const container = document.getElementById(id);
            if (!container) return;
            const canvas = container.querySelector('.ta-logo-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let width = canvas.width = canvas.offsetWidth;
            let height = canvas.height = canvas.offsetHeight;
            
            const resizeObserver = new ResizeObserver(() => {
                if (!canvas) return;
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
            });
            resizeObserver.observe(canvas);
            
            const particles = [];
            const orbitRadius = Math.min(width, height) * 0.38;
            
            for (let i = 0; i < 45; i++) {
                particles.push({
                    angle: Math.random() * Math.PI * 2,
                    radius: orbitRadius + (Math.random() - 0.5) * 60,
                    speed: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: Math.random() > 0.6 ? '#8b1d41' : '#ffd700'
                });
            }
            
            let active = true;
            function animate() {
                if (!active) return;
                if (!document.body.contains(canvas)) {
                    active = false;
                    resizeObserver.disconnect();
                    return;
                }
                ctx.clearRect(0, 0, width, height);
                
                // Draw grid
                ctx.strokeStyle = 'rgba(139, 29, 65, 0.04)';
                ctx.lineWidth = 1;
                const gridSize = 30;
                for (let x = 0; x < width; x += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, height);
                    ctx.stroke();
                }
                for (let y = 0; y < height; y += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                }
                
                // Update & Draw particles in orbit around the center logo
                const centerX = width / 2;
                const centerY = height / 2;
                particles.forEach(p => {
                    p.angle += p.speed;
                    const x = centerX + Math.cos(p.angle) * p.radius;
                    const y = centerY + Math.sin(p.angle) * p.radius;
                    
                    ctx.beginPath();
                    ctx.arc(x, y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.opacity;
                    ctx.fill();
                    
                    // Connect close particles
                    particles.forEach(p2 => {
                        const x2 = centerX + Math.cos(p2.angle) * p2.radius;
                        const y2 = centerY + Math.sin(p2.angle) * p2.radius;
                        const dist = Math.hypot(x - x2, y - y2);
                        if (dist < 75) {
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x2, y2);
                            ctx.strokeStyle = p.color;
                            ctx.globalAlpha = (1 - dist / 75) * 0.12 * p.opacity;
                            ctx.stroke();
                        }
                    });
                });
                
                requestAnimationFrame(animate);
            }
            animate();
        }, 200);

        return `
            <style>
                .slide-title-astorp {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    padding: 4cqh 6cqw;
                    box-sizing: border-box;
                    gap: 5cqw;
                    position: relative;
                    overflow: hidden;
                    background: var(--bg);
                }
                .slide-title-astorp::before {
                    content: " ";
                    display: block;
                    position: absolute;
                    top: 0; left: 0; bottom: 0; right: 0;
                    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                    z-index: 2;
                    background-size: 100% 2px, 3px 100%;
                    pointer-events: none;
                }
                .slide-title-astorp::after {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 5px;
                    background: rgba(255, 42, 109, 0.2);
                    box-shadow: 0 0 10px rgba(255, 42, 109, 0.8);
                    top: 0; left: 0;
                    animation: ta-scanline 6s linear infinite;
                    z-index: 3;
                    pointer-events: none;
                }
                @keyframes ta-scanline {
                    0% { top: -5%; }
                    100% { top: 105%; }
                }
                .ta-logo-side {
                    flex: 0 0 32cqw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ta-logo-container {
                    position: relative;
                    width: 28cqw;
                    height: 28cqw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .ta-logo-canvas {
                    position: absolute;
                    top: -15%; left: -15%; bottom: -15%; right: -15%;
                    width: 130%;
                    height: 130%;
                    pointer-events: none;
                    z-index: 1;
                }
                .ta-hud-ring-outer {
                    position: absolute;
                    width: 110%;
                    height: 110%;
                    border: 2px dashed var(--accent2, #ffd700);
                    border-radius: 50%;
                    opacity: 0.25;
                    animation: ta-spin-cw 25s linear infinite;
                    pointer-events: none;
                    z-index: 2;
                }
                .ta-hud-ring-inner {
                    position: absolute;
                    width: 95%;
                    height: 95%;
                    border: 1px dashed var(--accent);
                    border-radius: 50%;
                    opacity: 0.4;
                    animation: ta-spin-ccw 15s linear infinite;
                    pointer-events: none;
                    z-index: 2;
                }
                
                .ta-logo-wrapper {
                    position: relative;
                    width: 70%;
                    height: 70%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3;
                }
                .ta-logo-img {
                    width: 100%;
                    height: auto;
                    max-height: 80cqh;
                    filter: drop-shadow(0 0 2cqw rgba(139, 29, 65, 0.45));
                    animation: ta-holo-pulse 4s ease-in-out infinite alternate;
                    position: relative;
                    z-index: 3;
                }
                .ta-logo-shine {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 4;
                    mix-blend-mode: color-dodge;
                    opacity: 0;
                }
                .ta-shine-gold {
                    -webkit-mask: linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.85) 50%, transparent 70%);
                    mask: linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.85) 50%, transparent 70%);
                    -webkit-mask-size: 250% 100%;
                    mask-size: 250% 100%;
                    filter: brightness(2) sepia(1) saturate(5) hue-rotate(15deg);
                    animation: ta-shine-sweep-1 6s ease-in-out infinite;
                }
                .ta-shine-accent {
                    -webkit-mask: linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.85) 50%, transparent 70%);
                    mask: linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.85) 50%, transparent 70%);
                    -webkit-mask-size: 250% 100%;
                    mask-size: 250% 100%;
                    filter: brightness(2.5) drop-shadow(0 0 1cqw var(--accent));
                    animation: ta-shine-sweep-2 6s ease-in-out infinite 3s;
                }
                @keyframes ta-shine-sweep-1 {
                    0% { -webkit-mask-position: 150% 0; mask-position: 150% 0; opacity: 0; }
                    10% { opacity: 0.85; }
                    40% { -webkit-mask-position: -50% 0; mask-position: -50% 0; opacity: 0.85; }
                    50%, 100% { -webkit-mask-position: -50% 0; mask-position: -50% 0; opacity: 0; }
                }
                @keyframes ta-shine-sweep-2 {
                    0% { -webkit-mask-position: 150% 0; mask-position: 150% 0; opacity: 0; }
                    10% { opacity: 0.85; }
                    40% { -webkit-mask-position: -50% 0; mask-position: -50% 0; opacity: 0.85; }
                    50%, 100% { -webkit-mask-position: -50% 0; mask-position: -50% 0; opacity: 0; }
                }
                
                .ta-logo-overlay {
                    position: absolute;
                    width: 70%;
                    height: 90%;
                    pointer-events: none;
                    z-index: 4;
                    overflow: hidden;
                    border-radius: 8px;
                }
                .ta-laser-bar {
                    position: absolute;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--accent2, #ffd700), transparent);
                    box-shadow: 0 0 8px var(--accent2, #ffd700);
                    top: 0;
                    animation: ta-laser-move 4s ease-in-out infinite;
                }
                @keyframes ta-laser-move {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes ta-holo-pulse {
                    0% { transform: scale(1); filter: drop-shadow(0 0 1.5cqw rgba(139, 29, 65, 0.35)) brightness(1); }
                    50% { transform: scale(1.02); filter: drop-shadow(0 0 2.5cqw rgba(255, 42, 109, 0.55)) brightness(1.06); }
                    100% { transform: scale(1); filter: drop-shadow(0 0 1.5cqw rgba(139, 29, 65, 0.35)) brightness(1); }
                }
                .ta-telemetry {
                    position: absolute;
                    font-family: monospace;
                    font-size: clamp(0.5rem, 1.2cqh, 0.75rem);
                    color: var(--accent2, #ffd700);
                    opacity: 0.6;
                    text-transform: uppercase;
                    pointer-events: none;
                    z-index: 5;
                }
                .ta-tel-tl { top: -5%; left: -10%; }
                .ta-tel-tr { top: -5%; right: -10%; text-align: right; }
                .ta-tel-bl { bottom: -5%; left: -10%; }
                .ta-tel-br { bottom: -5%; right: -10%; text-align: right; }

                .ta-text-side {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    text-align: left;
                    z-index: 5;
                }
                .ta-badge {
                    font-size: clamp(0.7rem, 1.8cqh, 1.1rem);
                    font-weight: 800;
                    color: var(--accent2, #ffd700);
                    text-transform: uppercase;
                    letter-spacing: 0.3em;
                    margin-bottom: 2cqh;
                    text-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
                    animation: ta-pulse 2s infinite alternate;
                }
                @keyframes ta-pulse {
                    0% { opacity: 0.7; text-shadow: 0 0 5px rgba(255, 215, 0, 0.2); }
                    100% { opacity: 1; text-shadow: 0 0 15px rgba(255, 215, 0, 0.6); }
                }
                .ta-title {
                    font-size: clamp(2rem, 6cqh, 3.8rem);
                    font-weight: 900;
                    line-height: 1.1;
                    color: var(--text);
                    margin-bottom: 2.5cqh;
                    letter-spacing: -0.02em;
                }
                .ta-title span {
                    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2, #ffd700) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    filter: drop-shadow(0 0 10px rgba(139, 29, 65, 0.3));
                }
                .ta-subtitle {
                    font-size: clamp(1rem, 3.2cqh, 1.5rem);
                    color: var(--text-muted);
                    line-height: 1.4;
                    margin-bottom: 4cqh;
                    max-width: 90%;
                    font-weight: 500;
                }
                .ta-footer {
                    display: flex;
                    align-items: center;
                    gap: 1.5cqw;
                    padding-top: 3cqh;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    width: 100%;
                }
                .ta-footer-item {
                    display: flex;
                    flex-direction: column;
                }
                .ta-footer-label {
                    font-size: clamp(0.55rem, 1.4cqh, 0.75rem);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--accent);
                    font-weight: 700;
                    margin-bottom: 0.3cqh;
                }
                .ta-footer-val {
                    font-size: clamp(0.75rem, 2cqh, 1.05rem);
                    color: var(--text);
                    font-weight: 600;
                }
                .ta-divider {
                    width: 1px;
                    height: 4cqh;
                    background: rgba(255,255,255,0.15);
                }
                @keyframes ta-spin-cw {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes ta-spin-ccw {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                }
            </style>
            
            <div class="slide-title-astorp" id="${id}">
                <div class="ta-logo-side">
                    <div class="ta-logo-container">
                        <canvas class="ta-logo-canvas"></canvas>
                        
                        <div class="ta-hud-ring-outer"></div>
                        <div class="ta-hud-ring-inner"></div>
                        
                        <div class="ta-logo-overlay">
                            <div class="ta-laser-bar"></div>
                        </div>
                        
                        <div class="ta-logo-wrapper">
                            <img src="assets/astorp_logo.svg" class="ta-logo-img" alt="Åstorps logotyp" />
                            <img src="assets/astorp_logo.svg" class="ta-logo-shine ta-shine-gold" alt="" />
                            <img src="assets/astorp_logo.svg" class="ta-logo-shine ta-shine-accent" alt="" />
                        </div>
                        
                        <div class="ta-telemetry ta-tel-tl">SYS.LOC // 56.1347° N</div>
                        <div class="ta-telemetry ta-tel-tr">SYS.LON // 12.9458° E</div>
                        <div class="ta-telemetry ta-tel-bl">COGNITIVE.ACTIVE</div>
                        <div class="ta-telemetry ta-tel-br">SEC.ISOLATED // GDPR</div>
                    </div>
                </div>
                <div class="ta-text-side">
                    <div class="ta-badge">ÅSTORPS KOMMUN • BIN WORKSHOP</div>
                    <h1 class="ta-title">
                        AI för BIN:s <span>chefer</span>
                    </h1>
                    <p class="ta-subtitle">${s.subtitle || 'Från chattbottar till autonoma agenter'}</p>
                    <div class="ta-footer">
                        <div class="ta-footer-item">
                            <span class="ta-footer-label">FÖRELÄSARE</span>
                            <span class="ta-footer-val">${s.presenter?.name || 'Håkan Karlsson'}</span>
                        </div>
                        <div class="ta-divider"></div>
                        <div class="ta-footer-item">
                            <span class="ta-footer-label">ROLL</span>
                            <span class="ta-footer-val">${s.presenter?.title || 'Kommunlektor'}</span>
                        </div>
                        <div class="ta-divider"></div>
                        <div class="ta-footer-item">
                            <span class="ta-footer-label">DATUM</span>
                            <span class="ta-footer-val">${s.note || '21 maj 2026'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    const allTypes = {
        'title-astorp': renderTitleAstorp,
        'word-cascade': renderWordCascade,
        'box-reveal': renderBoxReveal,
        'bullet-build': renderBulletBuild,
        'line-chart': renderLineChart,
        'comparison': renderComparison,
        'timeline-vertical': renderTimelineVertical,
        'progress-ring': renderProgressRing,
        'number-wall': renderNumberWall,
        'bar-race': renderBarRace,
        'giant-text': renderGiantText,
        'callout': renderCallout,
        'section-divider': renderSectionDivider,
        'hero-image': renderHeroImage,
        'outro': renderOutro,
        'ai-conversation': renderAiConversation,
        'before-after': renderBeforeAfter,
        'prompt-reveal': renderPromptReveal,
        'pitfall': renderPitfall,
        'stat-compare': renderStatCompare,
        'voice-collage': renderVoiceCollage,
        'portrait-quote': renderPortraitQuote,
        'reflection': renderReflection,
        'collage': renderCollage,
        'process-chain': renderProcessChain,
        'acronym-list': renderAcronymList,
        'map-pins': renderMapPins,
        'map-progression': renderMapProgression,
        'mindmap': renderMindmap,
        'letter-morph': renderLetterMorph,
        'rewrite-progression': renderRewriteProgression,
        'quote': renderQuote,
        'map-journey': renderMapJourney,
        'mindmap-tree': renderMindmapTree,
        'warning-pulse': renderWarningPulse,
        'token-spinner': renderTokenSpinner,
        'bento-grid': renderBentoGrid,
        'glitch-warning': renderGlitchWarning,
        'semantic-nebula': renderSemanticNebula,
        'vector-nebula': renderVectorNebula,
        'prompt-card': renderPromptCard,
        'milestone-reveal': renderMilestoneReveal,
        'chaos-to-clarity': renderChaosToClarity,
        'leadership-mindmap': renderLeadershipMindmap,
        'gdpr-mindmap': renderLeadershipMindmap,
        'dual-analysis-prompt': renderDualAnalysisPrompt,
        'vep-stepper': renderVepStepper
    };

    /**
     * vep-stepper: Fullscreen step-by-step with image + text, one at a time.
     * Props: title, steps[] ({ image, title, text, accent })
     */
    function renderVepStepper(s) {
        const id = 'vs-' + Math.random().toString(36).slice(2, 8);
        const steps = s.steps || [];
        if (!steps.length) return '<div>No steps</div>';

        const stepsHtml = steps.map((step, i) => `
            <div class="vs-step ${i === 0 ? 'vs-active' : ''}" data-step="${i}">
                <div class="vs-img-wrap">
                    ${step.image ? `<img src="${step.image}" alt="${step.title || ''}" class="vs-img" />` : ''}
                </div>
                <div class="vs-text-wrap">
                    <div class="vs-step-num" style="color:${step.accent || 'var(--accent, #f97316)'}">Steg ${i + 1} av ${steps.length}</div>
                    <h3 class="vs-step-title" style="color:${step.accent || 'var(--accent, #f97316)'}">${step.title || ''}</h3>
                    <p class="vs-step-body">${step.text || ''}</p>
                </div>
            </div>
        `).join('');

        const dots = steps.map((_, i) => `<div class="vs-dot ${i === 0 ? 'vs-dot-active' : ''}" data-dot="${i}"></div>`).join('');

        setTimeout(() => {
            const container = document.getElementById(id);
            if (!container) return;
            let current = 0;
            const allSteps = container.querySelectorAll('.vs-step');
            const allDots = container.querySelectorAll('.vs-dot');

            function goTo(idx) {
                allSteps.forEach((el, i) => el.classList.toggle('vs-active', i === idx));
                allDots.forEach((el, i) => el.classList.toggle('vs-dot-active', i === idx));
                current = idx;
            }

            container.addEventListener('click', (e) => {
                if (current < steps.length - 1) {
                    e.stopPropagation();
                    goTo(current + 1);
                } else {
                    container.classList.remove('no-click-advance');
                }
            });
        }, 100);

        return `
            <style>
                .slide-vep-stepper {
                    display: flex; flex-direction: column; height: 100%; width: 100%;
                    padding: 3cqh 4cqw; box-sizing: border-box; position: relative; overflow: hidden;
                    justify-content: center;
                }
                .vs-title {
                    font-size: clamp(1.6rem, 4cqh, 2.8rem); font-weight: 700;
                    color: var(--text); margin-bottom: 2cqh; text-align: center;
                }
                .vs-step {
                    display: none; gap: clamp(1.5rem, 4cqw, 4rem);
                    align-items: center; width: 100%; max-width: 1100px; margin: 0 auto;
                    animation: vsFadeIn 0.5s ease;
                }
                .vs-step.vs-active { display: flex; }
                @keyframes vsFadeIn {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .vs-img-wrap {
                    flex: 0 0 clamp(120px, 28cqw, 340px);
                }
                .vs-img {
                    width: 100%; aspect-ratio: 1; object-fit: cover;
                    border-radius: clamp(12px, 2cqw, 24px);
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
                .vs-text-wrap { flex: 1; min-width: 0; }
                .vs-step-num {
                    font-size: clamp(0.8rem, 1.5cqw, 1.1rem); font-weight: 600;
                    text-transform: uppercase; letter-spacing: 2px; margin-bottom: 0.5cqh;
                    opacity: 0.7;
                }
                .vs-step-title {
                    font-size: clamp(1.8rem, 4cqw, 3.2rem); font-weight: 700;
                    margin-bottom: 1.5cqh; line-height: 1.15;
                }
                .vs-step-body {
                    font-size: clamp(1.1rem, 2.2cqw, 1.6rem); color: var(--text-muted);
                    line-height: 1.6; max-width: 600px;
                }
                .vs-dots {
                    display: flex; justify-content: center; gap: 0.8rem;
                    margin-top: 3cqh;
                }
                .vs-dot {
                    width: clamp(8px, 1cqw, 12px); height: clamp(8px, 1cqw, 12px);
                    border-radius: 50%; background: rgba(255,255,255,0.15);
                    transition: all 0.3s ease;
                }
                .vs-dot.vs-dot-active {
                    background: var(--accent, #f97316);
                    box-shadow: 0 0 8px var(--accent, #f97316);
                    transform: scale(1.3);
                }
            </style>
            <div class="slide-vep-stepper no-click-advance" id="${id}">
                ${s.title ? `<h2 class="vs-title">${s.title}</h2>` : ''}
                ${stepsHtml}
                <div class="vs-dots">${dots}</div>
                ${renderSourcesPopup(s.sources)}
            </div>
        `;
    }

    function registerTypes() {
        if (typeof window.slideTypeRegistry === 'object') {
            Object.assign(window.slideTypeRegistry, allTypes);
            console.log('[ComponentForge] Registered:', Object.keys(allTypes).join(', '));
        } else {
            setTimeout(registerTypes, 100);
        }
    }

    // Also patch watch.html renderSlideContent if in audience mode
    function patchWatchRenderer() {
        if (typeof window.renderSlideContent === 'function') {
            const original = window.renderSlideContent;
            window.renderSlideContent = function(data) {
                const s = data.slide || data;
                if (allTypes[s.type]) return allTypes[s.type](s);
                return original.apply(this, arguments);
            };
        }
    }

    // Init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            registerTypes();
            patchWatchRenderer();
        });
    } else {
        registerTypes();
        patchWatchRenderer();
    }

    // Expose for external use
    window.__componentForge = allTypes;
})();
