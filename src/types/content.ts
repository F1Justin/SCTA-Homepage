export interface Activity {
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  contentHtml: string;
}

export interface Blueprint {
  slug: string;
  title: string;
  category: string[];
  summary: string;
  coverImage: string;
  durationPerRound?: string;
  rounds?: string;
  participantsPerRound?: string;
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
