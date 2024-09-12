export enum FileExtension {
	JSON = 'json',
	JSONL = 'jsonl',
	CSV = 'csv',
}

export function isFileExtension(key: string | undefined): key is FileExtension {
	return key !== undefined && Object.values(FileExtension).includes(key as FileExtension);
}
