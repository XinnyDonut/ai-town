import type React from "react"
import { useState } from "react"
import { Upload, X } from "lucide-react"
import "./EditCharacter.css"
import { MultiSelectModal } from "./MultiSelectModal"
import { SpriteSelectionModal } from "./SpriteSelectionModal"
import { updateDescriptions } from "../../../../data/characters";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { AgentTemplateLoadModal } from './AgentTemplateLoadModal';


type Character = {
  id: string //convex db id must be string
  name: string //name is name
  description: string //actually identity in db
  goals: string //hmmm.. =plans for backend!
  preview: string //not my thing but returns f*. Change ticked
  isCustom?: boolean //not my thing
}

type EditCharacterProps = {
  selectedCharacter: string | null
  setSelectedCharacter: (id: string) => void
  onBack: () => void
  onNext: () => void
}

export const EditCharacter: React.FC<EditCharacterProps> = ({
  selectedCharacter,
  setSelectedCharacter,
  onBack,
  onNext,
}) => {
  
  const agentDocs = useQuery(api["customizeAgents/queries"].getAgents) ?? []; //must do this. Convex thing. hate it.
  const predefinedCharacters = agentDocs.map((doc) => ({
  id: doc._id,
  name: doc.name,
  description: doc.identity,
  goals: doc.plan,
  preview: doc.character
    ? `/sprites/${doc.character}.png`
    : "/placeholder.svg?height=200&width=200",
  isCustom: true,
  }));
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)
  const [showMultiSelectModal, setShowMultiSelectModal] = useState(false)
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([])
  const [showSpriteModal, setShowSpriteModal] = useState(false)
  const [showTemplateLoadModal, setShowTemplateLoadModal] = useState(false)
  const [addedToWorld, setAddedToWorld] = useState<boolean>(false);

  const handleImageUpload = () => {
    setShowSpriteModal(true)
  }

  const handleSpriteSelect = (sprite: string) => {
    if (editingCharacter) {
      setEditingCharacter((prev) => ({
        ...prev!,
        preview: `/sprites/${sprite}.png`,
      }))
    }
    setShowSpriteModal(false)
  }

  const createAgentMutation = useMutation(api["customizeAgents/mutations"].createAgent); //I want to mutate too. Damn.
  const updateAgentMutation = useMutation(api["customizeAgents/mutations"].updateAgent); //doesn't like my docker environment. Hate it more.
  const deleteAgentMutation =useMutation(api["customizeAgents/mutations"].deleteAgent);
  
  const handleLoadTemplate = async (template: Template) => {
    try {
      //When load template, clear any existing agents
      await Promise.all(
        agentDocs.map(agent => deleteAgentMutation({ id: agent._id }))
      );
  
      // Then create new agents with the agent in templates
      const createdAgents = await Promise.all(
        template.agents.map(agent => createAgentMutation(agent))
      );
      
      //though now, we haven't select any agents to acutally add to the world, we are simply loading the template for user to see
      setAddedToWorld(false)
      setSelectedCharacters([])
      setShowTemplateLoadModal(false);
    
    } catch (error) {
      console.error('Error loading template:', error);
      alert('Failed to load template. Please try again.');
    }
  };

  //this is the function that actually decide which agents to add to the world, when click the save selection btn on add to world
  const handleMultiSelectSave = async () => {
    if (selectedCharacters.length === 0) return

    try {
      // Delete all agents that are not selected
      const agentsToDelete = agentDocs
        .filter(agent => !selectedCharacters.includes(agent._id))
        .map(agent => agent._id)

      await Promise.all(
        agentsToDelete.map(id => deleteAgentMutation({ id }))
      )

      setShowMultiSelectModal(false)
      setAddedToWorld(true)
    } catch (error) {
      console.error('Error saving selection:', error)
      alert('Failed to save selection. Please try again.')
    }
  }

  // determine if Next button should be enabled--only able the btn when there is at least one agent added to the world
  const isNextEnabled = addedToWorld && selectedCharacters.length > 0
  
  const handleSave = async () => {
    if (!editingCharacter) return;
  
    //判断新建还是eedit
    const existing = agentDocs.find((doc) => doc._id === editingCharacter.id);
    if (!existing) {
      // 新建
      await createAgentMutation({
        name: editingCharacter.name,
        //  还原成 "f*"()，目前用的predefined spritesheet template，改的粗
        character: editingCharacter.preview
          .replace("/sprites/", "")
          .replace(".png", ""),
        identity: editingCharacter.description,
        plan: editingCharacter.goals,
      });
    } else {
      // edit
      await updateAgentMutation({
        id: { tableName: "agents", id: editingCharacter.id },
        name: editingCharacter.name,
        character: editingCharacter.preview
          .replace("/sprites/", "")
          .replace(".png", ""),
        identity: editingCharacter.description,
        plan: editingCharacter.goals,
      });
    }
  
    setIsEditing(false);
    setIsCreating(false);
    setEditingCharacter(null);
    // await updateDescriptions();
  };
  

  const handleCancel = () => {
    setIsEditing(false)
    setIsCreating(false)
    setEditingCharacter(null)
  }

  const currentCharacter = predefinedCharacters.find((char) => char.id === selectedCharacter)

  const renderCharacterForm = () => (
    <div className="character-details">  
      <div className="list-actions">
      {/**here is the part where added the templateModal rendering**/}
        <button className="pixel-btn" onClick={() => setShowTemplateLoadModal(true)}>
          Load Saved Template
        </button>
      {/*****/}
        <button className="pixel-btn" onClick={() => setIsCreating(true)}>
          Create Agent
        </button>
        <button className="pixel-btn" onClick={() => setShowMultiSelectModal(true)}>
          Add to World
        </button>
      </div>
      
      <div className="character-header">
        <input
          type="text"
          className="pixel-input"
          placeholder={isCreating ? "Agent Name" : "Character Name"}
          value={editingCharacter?.name || ""}
          onChange={(e) => setEditingCharacter((prev) => ({ ...prev!, name: e.target.value }))}
        />
      </div>
      <div className="character-preview">
        <div className="preview-upload">
          <img
            src={editingCharacter?.preview || "/placeholder.svg"}
            alt="Character preview"
            className="preview-image"
          />
          <button className="upload-btn pixel-btn" onClick={handleImageUpload}>
            <Upload size={16} />
            Choose Sprite
          </button>
        </div>
      </div>
      <div className="character-info">
        <div className="info-section">
          <h3>Description</h3>
          <textarea
            className="pixel-textarea"
            value={editingCharacter?.description || ""}
            onChange={(e) => setEditingCharacter((prev) => ({ ...prev!, description: e.target.value }))}
            placeholder="Enter character description..."
          />
        </div>
        <div className="info-section">
          <h3>Goals</h3>
          <textarea
            className="pixel-textarea"
            value={editingCharacter?.goals || ""}
            onChange={(e) => setEditingCharacter((prev) => ({ ...prev!, goals: e.target.value }))}
            placeholder="Enter character goals..."
          />
        </div>
      </div>
      <div className="edit-actions">
        <button className="pixel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="pixel-btn" onClick={handleSave} disabled={!editingCharacter?.name}>
          Save
        </button>
      </div>
    </div>
  )

  const renderCharacterDetails = () => (
    <div className="character-details">
      {selectedCharacter ? (
        <>
          <div className="character-header">
            <h2 className="character-name">{currentCharacter?.name}</h2>
          </div>
          <div className="character-preview-container">
            <img
              src={currentCharacter?.preview || "/placeholder.svg"}
              alt={`${currentCharacter?.name} preview`}
              className="preview-image"
            />
            <div className="character-actions">
              <button
                className="pixel-btn"
                onClick={() => {
                  setEditingCharacter(currentCharacter!)
                  setIsEditing(true)
                }}
              >
                Edit Character
              </button>
              <button className="pixel-btn advanced-btn">Advanced</button>
            </div>
          </div>
          <div className="character-info">
            <div className="info-section">
              <h3>Description</h3>
              <div className="scrollable-text">{currentCharacter?.description}</div>
            </div>
            <div className="info-section">
              <h3>Goals</h3>
              <div className="scrollable-text">{currentCharacter?.goals}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="character-placeholder">
          <p className="pixel-message">Select a character to view details</p>
        </div>
      )}
    </div>
  )

  const renderCharacterList = () => (
    <div className="character-list-container">
      <div className="list-actions">
      <button className="pixel-btn" onClick={() => setShowTemplateLoadModal(true)}>
          Load Saved Template
        </button>
        <button
          className="pixel-btn"
          onClick={() => {
            setEditingCharacter({
              id: "temp-new-" + Date.now(), //placeholder id. yikes.
              name: "",
              description: "",
              goals: "",
              preview: "/placeholder.svg?height=200&width=200",
              isCustom: true,
            });
            setIsCreating(true);
          }}
          
        >
          Create Agent
        </button>
        <button className="pixel-btn" onClick={() => setShowMultiSelectModal(true)}>
          Add to World
        </button>
      </div>
      <div className="character-list">
        {predefinedCharacters.map((character) => (
          <div
            key={character.id}
            className={`pixel-item ${selectedCharacter === character.id ? "selected" : ""}`}
            onClick={() => setSelectedCharacter(character.id)}
          >
            <img src={character.preview || "/placeholder.svg"} alt={character.name} className="character-thumbnail" />
            <span>{character.name}</span>
            {character.isCustom && <span className="custom-badge">Custom</span>}
          </div>
          
        ))}
      </div>
    </div>
    
  )

  const renderSelectedCharactersThumbnails = () => (
    <div className="selected-characters-thumbnails">
      <h3 className="pixel-subtitle">Selected Characters</h3>
      <div className="thumbnails-container">
        {selectedCharacters.map((id) => {
          const character = predefinedCharacters.find((c) => c.id === id)
          return (
            <div key={id} className="selected-thumbnail">
              <img src={character?.preview || "/placeholder.svg"} alt={character?.name} className="thumbnail-image" />
              <button
                className="remove-thumbnail"
                onClick={() => setSelectedCharacters((prev) => prev.filter((charId) => charId !== id))}
              >
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="pixel-container">
      <h1 className="pixel-title">Edit Character</h1>
      <div className="pixel-content character-editor">
        <div className="character-list-container">
          {renderCharacterList()}
          {selectedCharacters.length > 0 && renderSelectedCharactersThumbnails()}
        </div>
        {isCreating || isEditing ? renderCharacterForm() : renderCharacterDetails()}
      </div>
      <div className="pixel-actions">
        <button className="pixel-btn" onClick={onBack}>
          Back
        </button>
        <button className="pixel-btn" onClick={onNext} disabled={!selectedCharacter && selectedCharacters.length === 0}>
          Next
        </button>
      </div>
      {/*******/}
      {showTemplateLoadModal && (
        <AgentTemplateLoadModal
          onClose={() => setShowTemplateLoadModal(false)}
          onLoadTemplate={handleLoadTemplate}
        />
      )}
      {/*******/}
      {showMultiSelectModal && (
        <MultiSelectModal
          characters={predefinedCharacters}
          selectedCharacters={selectedCharacters}
          onSelect={(id) => {
            setSelectedCharacters((prev) =>
              prev.includes(id) ? prev.filter((charId) => charId !== id) : [...prev, id],
            )
          }}
          onClose={() => {
            setShowMultiSelectModal(false)
            setSelectedCharacters([])
            setAddedToWorld(false)
          }}
          onSave={handleMultiSelectSave}//here in "ADD TO WORLD" when you click save selection, the agents will be added to world
        />
      )}
      {showSpriteModal && (
        <SpriteSelectionModal onSelect={handleSpriteSelect} onClose={() => setShowSpriteModal(false)} />
      )}
    </div>
  )
}

