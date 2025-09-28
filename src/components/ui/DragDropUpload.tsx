"use client";

import React, { useState, useRef, DragEvent } from "react";

interface DragDropUploadProps {
	onFileSelect: (file: File | null) => void;
	selectedFile: File | null;
	disabled?: boolean;
	maxFileSize?: number;
}

export default function DragDropUpload({
	onFileSelect,
	selectedFile,
	disabled,
	maxFileSize = 80 * 1024 * 1024,
}: DragDropUploadProps) {
	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (!disabled) {
			setIsDragOver(true);
		}
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);

		if (disabled) return;

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			const file = files[0];
			if (file.type.startsWith("video/")) {
				onFileSelect(file);
			} else {
				alert("Please select a video file");
			}
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			onFileSelect(files[0]);
		}
	};

	const handleClick = () => {
		if (!disabled && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleRemoveFile = () => {
		onFileSelect(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	return (
		<div className="mb-2">
			<input
				ref={fileInputRef}
				type="file"
				accept="video/*"
				onChange={handleFileSelect}
				className="hidden"
				disabled={disabled}
			/>

			<div
				onClick={handleClick}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`relative cursor-pointer rounded-xl border-3 border-dashed p-8 text-center transition-all duration-300 ${
					isDragOver
						? "scale-[1.02] border-stone-400 bg-red-500/10"
						: "border-stone-400 bg-stone-400 hover:border-stone-400 hover:bg-stone-600"
				} ${disabled ? "cursor-not-allowed opacity-60" : "hover:scale-[1.01]"} ${selectedFile ? "border-stone-400 bg-red-500/10" : ""} flex min-h-[240px] flex-col items-center justify-center shadow-lg`}
			>
				{selectedFile ? (
					<div className="space-y-4">
						<div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 shadow-lg">
							<svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
								<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
							</svg>
						</div>
						<div>
							<p className="mb-1 text-lg font-semibold">{selectedFile.name}</p>
							<p className="text-sm">{formatFileSize(selectedFile.size)}</p>
						</div>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleClick();
								}}
								className="rounded-lg bg-stone-300 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-emerald-700"
								disabled={disabled}
							>
								Change File
							</button>
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									handleRemoveFile();
								}}
								className="rounded-lg bg-stone-300 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-emerald-700"
								disabled={disabled}
							>
								Remove
							</button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						<div
							className={`inline-flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
								isDragOver
									? "scale-110 bg-gradient-to-r from-stone-400 to-stone-600"
									: "bg-gradient-to-r from-stone-400 to-stone-600"
							}`}
						>
							<svg
								className="h-8 w-8"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>
						<div>
							<p className="mb-2 text-xl font-bold">
								{isDragOver ? "Drop your video here!" : "Upload your gaming clip"}
							</p>
							<p className="mb-2">Drag and drop a video file, or click to browse</p>
							<p className="text-sm">
								Supports: MP4, MOV, AVI, WebM • Max size:{" "}
								{Math.round(maxFileSize / (1024 * 1024))}MB
							</p>
						</div>
						{!disabled && (
							<div className="inline-flex transform items-center gap-2 rounded-lg bg-gradient-to-r from-stone-600 to-stone-500 px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-700 hover:to-red-600">
								<svg
									className="h-5 w-5"
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
								Select File
							</div>
						)}
					</div>
				)}

				{/* Animated background pattern */}
				<div className="pointer-events-none absolute inset-0 opacity-5">
					<div
						className="h-full w-full"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EEEEEE' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
							backgroundSize: "60px 60px",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
