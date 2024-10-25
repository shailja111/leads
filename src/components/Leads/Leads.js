// Leads.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [decisionMakers, setDecisionMakers] = useState([]);
  const [contractDiscussions, setContractDiscussions] = useState([]);

  useEffect(() => {
    axios
      .get("LeadsGenerate/FetchAndSaveData")
      .then((response) => {
        if (response.data && response.data.leadsList) {
          // Initial filtering based on status
          setLeads(response.data.leadsList.filter(lead => lead.LeadsStatus === 0));
          setDiscussions(response.data.leadsList.filter(lead => lead.LeadsStatus === 1));
          setDecisionMakers(response.data.leadsList.filter(lead => lead.LeadsStatus === 2));
          setContractDiscussions(response.data.leadsList.filter(lead => lead.LeadsStatus === 3));
        }
      })
      .catch((error) => {
        console.error("Error fetching leads:", error);
      });
  }, []);

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await axios.post("Leads/UpdateLeadStatus", {
        LeadId: leadId,
        LeadsStatus: newStatus,
        UserID: "1",
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Handle reordering within the same column
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "leads") {
        const reorderedLeads = Array.from(leads);
        const [movedLead] = reorderedLeads.splice(source.index, 1);
        reorderedLeads.splice(destination.index, 0, movedLead);
        setLeads(reorderedLeads);
      } else if (source.droppableId === "discussions") {
        const reorderedDiscussions = Array.from(discussions);
        const [movedLead] = reorderedDiscussions.splice(source.index, 1);
        reorderedDiscussions.splice(destination.index, 0, movedLead);
        setDiscussions(reorderedDiscussions);
      } else if (source.droppableId === "decisionMaking") {
        const reorderedDecisionMakers = Array.from(decisionMakers);
        const [movedLead] = reorderedDecisionMakers.splice(source.index, 1);
        reorderedDecisionMakers.splice(destination.index, 0, movedLead);
        setDecisionMakers(reorderedDecisionMakers);
      } else if (source.droppableId === "contractDiscussion") {
        const reorderedContractDiscussions = Array.from(contractDiscussions);
        const [movedLead] = reorderedContractDiscussions.splice(source.index, 1);
        reorderedContractDiscussions.splice(destination.index, 0, movedLead);
        setContractDiscussions(reorderedContractDiscussions);
      }
    } else {
      // Handle moving between different columns
      let leadToMove;
      const newLeads = Array.from(leads);
      const newDiscussions = Array.from(discussions);
      const newDecisionMakers = Array.from(decisionMakers);
      const newContractDiscussions = Array.from(contractDiscussions);

      if (source.droppableId === "leads" && destination.droppableId === "discussions") {
        leadToMove = newLeads[source.index];
        newLeads.splice(source.index, 1);
        newDiscussions.splice(destination.index, 0, leadToMove);
        setLeads(newLeads);
        setDiscussions(newDiscussions);
        updateLeadStatus(leadToMove.Id, 1); // Update status to 1
      } else if (source.droppableId === "discussions" && destination.droppableId === "decisionMaking") {
        leadToMove = newDiscussions[source.index];
        newDiscussions.splice(source.index, 1);
        newDecisionMakers.splice(destination.index, 0, leadToMove);
        setDiscussions(newDiscussions);
        setDecisionMakers(newDecisionMakers);
        updateLeadStatus(leadToMove.Id, 2); // Update status to 2
      } else if (source.droppableId === "decisionMaking" && destination.droppableId === "contractDiscussion") {
        leadToMove = newDecisionMakers[source.index];
        newDecisionMakers.splice(source.index, 1);
        newContractDiscussions.splice(destination.index, 0, leadToMove);
        setDecisionMakers(newDecisionMakers);
        setContractDiscussions(newContractDiscussions);
        updateLeadStatus(leadToMove.Id, 3); // Update status to 3
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="leads-container">
        <Droppable droppableId="leads">
          {(provided) => (
            <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Leads</h2>
              <div className="leads-list">
                {leads.map((ad, index) => (
                  <Draggable key={ad.Id} draggableId={String(ad.Id)} index={index}>
                    {(provided) => (
                      <div
                        className="lead-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="lead-content">
                          <p><strong>Ad :</strong> {ad.AdName.slice(0, 26)}...</p>
                          <p><strong>Name:</strong> {ad.FullName}</p>
                          <p><strong>Phone:</strong> {ad.PhoneNumber}</p>
                          <p><strong>Email:</strong> {ad.Email}</p>
                          <p><strong>City:</strong> {ad.City}</p>
                          <p><strong>Time:</strong> {new Date(ad.CreatedTime).toLocaleString()}</p>
                        </div>
                        <div className="lead-icon">
                          <img
                            src={ad.Platform === "ig"
                              ? "https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_640.jpg"
                              : "https://logowik.com/content/uploads/images/672_fb_icon.jpg"}
                            alt={ad.Platform === "ig" ? "Instagram" : "Facebook"}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        <Droppable droppableId="discussions">
          {(provided) => (
            <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Discussions</h2>
              <div className="leads-list">
                {discussions.map((ad, index) => (
                  <Draggable key={ad.Id} draggableId={String(ad.Id)} index={index}>
                    {(provided) => (
                      <div
                        className="lead-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="lead-content">
                          <p><strong>Ad :</strong> {ad.AdName.slice(0, 26)}...</p>
                          <p><strong>Name:</strong> {ad.FullName}</p>
                          <p><strong>Phone:</strong> {ad.PhoneNumber}</p>
                          <p><strong>Email:</strong> {ad.Email}</p>
                          <p><strong>City:</strong> {ad.City}</p>
                          <p><strong>Time:</strong> {new Date(ad.CreatedTime).toLocaleString()}</p>
                        </div>
                        <div className="lead-icon">
                          <img
                            src={ad.Platform === "ig"
                              ? "https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_640.jpg"
                              : "https://logowik.com/content/uploads/images/672_fb_icon.jpg"}
                            alt={ad.Platform === "ig" ? "Instagram" : "Facebook"}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        <Droppable droppableId="decisionMaking">
          {(provided) => (
            <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Decision Making</h2>
              <div className="leads-list">
                {decisionMakers.map((ad, index) => (
                  <Draggable key={ad.Id} draggableId={String(ad.Id)} index={index}>
                    {(provided) => (
                      <div
                        className="lead-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="lead-content">
                          <p><strong>Ad :</strong> {ad.AdName.slice(0, 26)}...</p>
                          <p><strong>Name:</strong> {ad.FullName}</p>
                          <p><strong>Phone:</strong> {ad.PhoneNumber}</p>
                          <p><strong>Email:</strong> {ad.Email}</p>
                          <p><strong>City:</strong> {ad.City}</p>
                          <p><strong>Time:</strong> {new Date(ad.CreatedTime).toLocaleString()}</p>
                        </div>
                        <div className="lead-icon">
                          <img
                            src={ad.Platform === "ig"
                              ? "https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_640.jpg"
                              : "https://logowik.com/content/uploads/images/672_fb_icon.jpg"}
                            alt={ad.Platform === "ig" ? "Instagram" : "Facebook"}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        <Droppable droppableId="contractDiscussion">
          {(provided) => (
            <div className="column" {...provided.droppableProps} ref={provided.innerRef}>
              <h2>Contract Discussion</h2>
              <div className="leads-list">
                {contractDiscussions.map((ad, index) => (
                  <Draggable key={ad.Id} draggableId={String(ad.Id)} index={index}>
                    {(provided) => (
                      <div
                        className="lead-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="lead-content">
                          <p><strong>Ad :</strong> {ad.AdName.slice(0, 26)}...</p>
                          <p><strong>Name:</strong> {ad.FullName}</p>
                          <p><strong>Phone:</strong> {ad.PhoneNumber}</p>
                          <p><strong>Email:</strong> {ad.Email}</p>
                          <p><strong>City:</strong> {ad.City}</p>
                          <p><strong>Time:</strong> {new Date(ad.CreatedTime).toLocaleString()}</p>
                        </div>
                        <div className="lead-icon">
                          <img
                            src={ad.Platform === "ig"
                              ? "https://cdn.pixabay.com/photo/2016/08/09/17/52/instagram-1581266_640.jpg"
                              : "https://logowik.com/content/uploads/images/672_fb_icon.jpg"}
                            alt={ad.Platform === "ig" ? "Instagram" : "Facebook"}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default Leads;
