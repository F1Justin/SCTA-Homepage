export interface ActivityPoster {
  src: string;
  width: number;
  height: number;
  unoptimized?: true;
}

export interface ActivitySummary {
  slug: string;
  title: string;
  date: string;
  category: string;
  poster: ActivityPoster | null;
  preview: string;
}

export interface Activity extends Omit<ActivitySummary, 'preview'> {
  contentHtml: string;
  description: string;
}

export interface BlueprintSummary {
  slug: string;
  title: string;
  category: string[];
  summary: string;
  coverImage: string;
  durationPerRound?: string;
  participantsPerRound?: string;
}

export interface Blueprint extends BlueprintSummary {
  rounds?: string;
  participantCriteria?: string;
  hardwareRequirements?: string[];
  softwareRequirements?: string[];
  materialsNeeded?: string[];
  rewardSuggestion?: string;
  sections: {
    rules?: string;
    procedure?: string;
    tips?: string;
  };
}
