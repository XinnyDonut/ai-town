import type React from "react"
import { Check, X } from "lucide-react"// what is this for?
import "./MultiSelectModal.css"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api";


type Character = {
  id: string
  name: string
  preview: string
  description: string
  goals: string
  character: string
}

type MultiSelectModalProps = {
  characters: Character[]
  selectedCharacters: string[]
  onSelect: (id: string) => void
  onClose: () => void
  onSave: () => void
}

export const MultiSelectModal: React.FC<MultiSelectModalProps> = ({
  characters,
  selectedCharacters,
  onSelect,
  onClose,
  onSave,
}) => {
  const saveTemplateMutation= useMutation(api["customizeAgents/mutations"].saveTemplate)

  const handleSaveWithTemplate =async () => {
    if (selectedCharacters.length === 0) return;
    const name = window.prompt("Enter template name (optional)");
    if (name === null) return; 

    console.log("Characters:", characters);
    console.log("Selected IDs:", selectedCharacters);

    const selectAgents =characters
      .filter(char=>selectedCharacters.includes(char.id))
      .map(char=>{
        console.log("Character being mapped:", char);
        const spriteCharacter = char.preview
        .replace("/sprites/", "")
        .replace(".png", "");
        return{
          name:char.name,
          character:spriteCharacter,
          identity:char.description,
          plan:char.goals,
          }
      })
      console.log("Mapped agents:", selectAgents);
    try {
      await saveTemplateMutation({
        name:name||`Template ${new Date().toLocaleString()}`,
        agents:selectAgents,
      })
      onSave()
    }catch(error){
      console.error("Failed to save Template",error)
    }
  }
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="pixel-subtitle">Select Multiple Characters</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className="character-grid">
          {characters.map((character) => (
            <div
              key={character.id}
              className={`character-card ${selectedCharacters.includes(character.id) ? "selected" : ""}`}
              onClick={() => onSelect(character.id)}
            >
              <img src={character.preview || "/placeholder.svg"} alt={character.name} className="character-avatar" />
              <span className="character-name">{character.name}</span>
              {selectedCharacters.includes(character.id) && <Check className="check-icon" size={24} />}
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button className="pixel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="pixel-btn" onClick={handleSaveWithTemplate} disabled={selectedCharacters.length === 0}>
            Save Selection
          </button>
        </div>
      </div>
    </div>
  )
}

