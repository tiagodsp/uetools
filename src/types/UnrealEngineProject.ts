// UnrealModule
export interface UnrealModule {
    Name: string;
    Type: string;
    LoadingPhase: string;
    AdditionalDependencies: string[];
}


export interface UnrealEnginePlugin {
    FileVersion: number;
    Version: string;
    VersionName: string;
    FriendlyName: string;
    Description: string;
    Category: string;
    CreatedBy: string;
    CreatedByURL: string;
    DocsURL: string;
    MarketplaceURL: string;
    SupportURL: string;
    CanContainContent: boolean;
    IsBetaVersion: boolean;
    IsExperimentalVersion: boolean;
    Installed: boolean;
    Modules: UnrealModule[];
}

// Unreal Engine project struct
export interface UnrealEngineProject {
    Description: string;
    Categories: string[];
    Modules: UnrealModule[];
    EngineAssociation: string;
    Plugins: {
        Name: string;
        Enabled: boolean;
        TargetAllowList: string[];
    }[];
    ProjectPlugins: UnrealEnginePlugin[];
}
