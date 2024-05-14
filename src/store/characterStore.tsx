import {create} from "zustand";
import {TaiwanCainCharacterInfo} from "@/shared/response/TaiwanCain.ts";


interface CharacterStore {
    selectMId: number;
    setMId: (m_id: number) => void;
    selectCharacterInfo: TaiwanCainCharacterInfo;
    setCharacterInfo: (info: TaiwanCainCharacterInfo) => void;
}

export const useCharacterStore = create<CharacterStore>((set) => ({
    selectMId: 0,
    setMId: (m_id: number) => set({selectMId: m_id}),
    selectCharacterInfo: {} as TaiwanCainCharacterInfo,
    setCharacterInfo: (info: TaiwanCainCharacterInfo) => set({selectCharacterInfo: info}),
}));