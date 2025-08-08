import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

type Props = {
	containerRef: React.RefObject<HTMLElement | null>;
	targetSelector?: string; // elements to snap corners to
	spinDuration?: number; // seconds per rotation
	hideDefaultCursor?: boolean; // hide cursor inside container only
};

const TargetCursor: React.FC<Props> = ({
	containerRef,
	targetSelector = '.cursor-target',
	spinDuration = 2,
	hideDefaultCursor = true,
}) => {
	const cursorRef = useRef<HTMLDivElement | null>(null);
	const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
	const dotRef = useRef<HTMLDivElement | null>(null);
	const spinTl = useRef<gsap.core.Timeline | null>(null);
	const isTouch = useRef(false);

	const constants = useMemo(
		() => ({ borderWidth: 3, cornerSize: 12, parallaxStrength: 0.00005 }),
		[]
	);

	useEffect(() => {
		isTouch.current =
			typeof window !== 'undefined' &&
			(('ontouchstart' in window) || (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches));
	}, []);

	const moveCursor = useCallback((clientX: number, clientY: number) => {
		if (!cursorRef.current || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
	}, [containerRef]);

	useEffect(() => {
		if (!containerRef.current || !cursorRef.current) return;
		if (isTouch.current) return; // disable on touch devices

		const container = containerRef.current as HTMLElement;
		const cursor = cursorRef.current as HTMLDivElement;

		const originalCursor = container.style.cursor;
		if (hideDefaultCursor) container.style.cursor = 'none';

		cornersRef.current = cursor.querySelectorAll<HTMLDivElement>('.target-cursor-corner');
		// Hide corners initially
		if (cornersRef.current) gsap.set(Array.from(cornersRef.current), { autoAlpha: 0 });

		let activeTarget: Element | null = null;
		let currentTargetMove: ((ev: MouseEvent) => void) | null = null;
		let currentLeaveHandler: (() => void) | null = null;
		let isAnimatingToTarget = false;
		let resumeTimeout: number | null = null;

		const cleanupTarget = (target: Element) => {
			if (currentTargetMove) (target as any).removeEventListener('mousemove', currentTargetMove as any);
			if (currentLeaveHandler) (target as any).removeEventListener('mouseleave', currentLeaveHandler as any);
			currentTargetMove = null;
			currentLeaveHandler = null;
		};

		// center inside container
		const rect = container.getBoundingClientRect();
		gsap.set(cursor, { xPercent: -50, yPercent: -50, x: rect.width / 2, y: rect.height / 2, autoAlpha: 0 });

		const createSpinTimeline = () => {
			if (spinTl.current) spinTl.current.kill();
			spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
		};
		createSpinTimeline();

		const moveHandler = (e: MouseEvent) => {
			moveCursor(e.clientX, e.clientY);
			// If pointer left the active target (between cards), trigger leave
			if (activeTarget) {
				const el = document.elementFromPoint(e.clientX, e.clientY);
				const overNow = !!el && (el === activeTarget || (el.closest && el.closest(targetSelector) === activeTarget));
				if (!overNow && currentLeaveHandler) currentLeaveHandler();
			}
		};

		const scrollHandler = () => {
			if (!activeTarget || !cursorRef.current) return;
			const cx = (gsap.getProperty(cursorRef.current, 'x') as number) || 0;
			const cy = (gsap.getProperty(cursorRef.current, 'y') as number) || 0;
			const crect = container.getBoundingClientRect();
			const viewX = cx + crect.left;
			const viewY = cy + crect.top;
			const el = document.elementFromPoint(viewX, viewY);
			const stillOver = !!el && (el === activeTarget || (el.closest && el.closest(targetSelector) === activeTarget));
			if (!stillOver && currentLeaveHandler) currentLeaveHandler();
		};

		const mouseDownHandler = () => {
			if (!dotRef.current) return;
			gsap.to(dotRef.current, { scale: 0.7, duration: 0.25 });
			gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
		};
		const mouseUpHandler = () => {
			if (!dotRef.current) return;
			gsap.to(dotRef.current, { scale: 1, duration: 0.25 });
			gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
		};

		const updateCorners = (target: Element, mouseX?: number, mouseY?: number) => {
			if (!cornersRef.current || !cursorRef.current) return;
			const rect = (target as HTMLElement).getBoundingClientRect();
			const cursorRect = cursorRef.current.getBoundingClientRect();
			const cursorCenterX = cursorRect.left + cursorRect.width / 2;
			const cursorCenterY = cursorRect.top + cursorRect.height / 2;

			const [tlc, trc, brc, blc] = Array.from(cornersRef.current);
			const { borderWidth, cornerSize, parallaxStrength } = constants;

			let tlOffset = { x: rect.left - cursorCenterX - borderWidth, y: rect.top - cursorCenterY - borderWidth };
			let trOffset = { x: rect.right - cursorCenterX + borderWidth - cornerSize, y: rect.top - cursorCenterY - borderWidth };
			let brOffset = { x: rect.right - cursorCenterX + borderWidth - cornerSize, y: rect.bottom - cursorCenterY + borderWidth - cornerSize };
			let blOffset = { x: rect.left - cursorCenterX - borderWidth, y: rect.bottom - cursorCenterY + borderWidth - cornerSize };

			if (mouseX !== undefined && mouseY !== undefined) {
				const targetCenterX = rect.left + rect.width / 2;
				const targetCenterY = rect.top + rect.height / 2;
				const offX = (mouseX - targetCenterX) * parallaxStrength;
				const offY = (mouseY - targetCenterY) * parallaxStrength;
				tlOffset.x += offX; tlOffset.y += offY;
				trOffset.x += offX; trOffset.y += offY;
				brOffset.x += offX; brOffset.y += offY;
				blOffset.x += offX; blOffset.y += offY;
			}

			const tl = gsap.timeline();
			const corners = [tlc, trc, brc, blc];
			const offsets = [tlOffset, trOffset, brOffset, blOffset];
			corners.forEach((corner, i) => {
				tl.to(corner, { x: offsets[i].x, y: offsets[i].y, duration: 0.2, ease: 'power2.out' }, 0);
			});
		};

		const enterHandler = (e: MouseEvent) => {
			const directTarget = e.target as Element;
			// climb up within container to the first matching target
			const allTargets: Element[] = [];
			let current: Element | null = directTarget;
			while (current && current !== container) {
				if ('matches' in current && (current as Element).matches(targetSelector)) allTargets.push(current);
				current = current.parentElement;
			}
			const target = allTargets[0] || null;
			if (!target || !cursorRef.current || !cornersRef.current) return;
			if (activeTarget === target) return;

			if (activeTarget) cleanupTarget(activeTarget);
			if (resumeTimeout) { window.clearTimeout(resumeTimeout); resumeTimeout = null; }
			activeTarget = target;

			// pause spin, reset rotation, show corners
			spinTl.current?.pause();
			gsap.set(cursorRef.current, { rotation: 0 });
			gsap.to(Array.from(cornersRef.current), { autoAlpha: 1, duration: 0.12, ease: 'power2.out' });

			isAnimatingToTarget = true;
			updateCorners(target);
			window.setTimeout(() => { isAnimatingToTarget = false; }, 1);

			let moveThrottle: number | null = null;
			const targetMove = (ev: MouseEvent) => {
				if (moveThrottle || isAnimatingToTarget) return;
				moveThrottle = requestAnimationFrame(() => {
					updateCorners(target, ev.clientX, ev.clientY);
					moveThrottle = null;
				});
			};

			const leaveHandler = () => {
				activeTarget = null;
				isAnimatingToTarget = false;
				if (cornersRef.current) {
					const corners = Array.from(cornersRef.current);
					gsap.killTweensOf(corners);
					const { cornerSize } = constants;
					const positions = [
						{ x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
						{ x: cornerSize * 0.5, y: -cornerSize * 1.5 },
						{ x: cornerSize * 0.5, y: cornerSize * 0.5 },
						{ x: -cornerSize * 1.5, y: cornerSize * 0.5 },
					];
					const tl = gsap.timeline();
					corners.forEach((corner, i) => {
						tl.to(corner, { x: positions[i].x, y: positions[i].y, duration: 0.3, ease: 'power3.out' }, 0);
					});
					tl.to(corners, { autoAlpha: 0, duration: 0.12, ease: 'power2.out' }, 0);
				}

				resumeTimeout = window.setTimeout(() => {
					if (!activeTarget && cursorRef.current) {
						const currentRotation = (gsap.getProperty(cursorRef.current, 'rotation') as number) || 0;
						const normalized = currentRotation % 360;
						spinTl.current?.kill();
						spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
						gsap.to(cursorRef.current, {
							rotation: normalized + 360,
							duration: spinDuration * (1 - normalized / 360),
							ease: 'none',
							onComplete: () => { spinTl.current?.restart(); },
						});
					}
					resumeTimeout = null;
				}, 50);

				cleanupTarget(target);
			};

			currentTargetMove = targetMove;
			currentLeaveHandler = leaveHandler;
			(target as any).addEventListener('mousemove', targetMove as any);
			(target as any).addEventListener('mouseleave', leaveHandler as any);
		};

		const onContainerEnter = (e: MouseEvent) => {
			gsap.to(cursor, { autoAlpha: 1, duration: 0.15 });
			moveHandler(e);
		};
		const onContainerLeave = () => {
			gsap.to(cursor, { autoAlpha: 0, duration: 0.15 });
			if (activeTarget && currentLeaveHandler) currentLeaveHandler();
		};

		container.addEventListener('mousemove', moveHandler as any);
		container.addEventListener('mouseover', enterHandler as any, { passive: true } as any);
		container.addEventListener('mousedown', mouseDownHandler);
		container.addEventListener('mouseup', mouseUpHandler);
		container.addEventListener('mouseenter', onContainerEnter as any);
		container.addEventListener('mouseleave', onContainerLeave as any);
		window.addEventListener('scroll', scrollHandler, { passive: true });

		return () => {
			container.removeEventListener('mousemove', moveHandler as any);
			container.removeEventListener('mouseover', enterHandler as any);
			container.removeEventListener('mousedown', mouseDownHandler);
			container.removeEventListener('mouseup', mouseUpHandler);
			container.removeEventListener('mouseenter', onContainerEnter as any);
			container.removeEventListener('mouseleave', onContainerLeave as any);
			window.removeEventListener('scroll', scrollHandler);
			if (activeTarget) cleanupTarget(activeTarget);
			spinTl.current?.kill();
			container.style.cursor = originalCursor;
		};
	}, [containerRef, targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor]);

	useEffect(() => {
		if (!cursorRef.current || !spinTl.current) return;
		spinTl.current.kill();
		spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
	}, [spinDuration]);

	if (isTouch.current) return null;

	return (
		<div className="pointer-events-none" style={{ position: 'absolute', inset: 0, zIndex: 10 }} aria-hidden>
			<div
				ref={cursorRef}
				className="mix-blend-difference transform -translate-x-1/2 -translate-y-1/2"
				style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, willChange: 'transform', opacity: 0 }}
			>
				<div
					ref={dotRef}
					className="absolute left-1/2 top-1/2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
					style={{ width: 4, height: 4, willChange: 'transform' }}
				/>
				<div className="target-cursor-corner absolute left-1/2 top-1/2 border-white transform -translate-x-[150%] -translate-y-[150%] border-r-0 border-b-0"
					style={{ width: 12, height: 12, borderWidth: 3, willChange: 'transform' }}
				/>
				<div className="target-cursor-corner absolute left-1/2 top-1/2 border-white transform translate-x-1/2 -translate-y-[150%] border-l-0 border-b-0"
					style={{ width: 12, height: 12, borderWidth: 3, willChange: 'transform' }}
				/>
				<div className="target-cursor-corner absolute left-1/2 top-1/2 border-white transform translate-x-1/2 translate-y-1/2 border-l-0 border-t-0"
					style={{ width: 12, height: 12, borderWidth: 3, willChange: 'transform' }}
				/>
				<div className="target-cursor-corner absolute left-1/2 top-1/2 border-white transform -translate-x-[150%] translate-y-1/2 border-r-0 border-t-0"
					style={{ width: 12, height: 12, borderWidth: 3, willChange: 'transform' }}
				/>
			</div>
		</div>
	);
};

export default TargetCursor;

