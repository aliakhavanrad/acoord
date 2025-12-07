import { Voice } from "../(models)/voice";

const API_URL = "https://api.acoord.ir";
//const API_URL = "https://localhost:44341";

async function getAllAcceptedVoices(): Promise<Voice[]> {  
    const response = await fetch(`${API_URL}/Playlist/GetAllAcceptedVoices`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const voices: Voice[] = await response.json();
    return voices;
}

const soundService = {
    getAllAcceptedVoices
}

export default soundService;