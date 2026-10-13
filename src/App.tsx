/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { VotingRoomView } from './components/VotingRoomView';
import { WinnerRevealModal } from './components/WinnerRevealModal';
import { ShareSummaryModal } from './components/ShareSummaryModal';
import { AddSpotModal } from './components/AddSpotModal';
import { VotingRoom, RestaurantSpot } from './types';
import {
  getSavedRoom,
  saveRoom,
  getAllAvailableSpots,
  addCustomSpot,
  saveCustomSpots,
  getSavedVoterName,
  saveVoterName,
  clearCustomSpots,
} from './utils/storage';
import { OPTIONAL_HYDERABAD_TEST_PRESET } from './data/restaurants';

export default function App() {
  const [room, setRoom] = useState<VotingRoom | null>(() => getSavedRoom());
  const [voterName, setVoterName] = useState<string>(() => getSavedVoterName());
  const [availableSpots, setAvailableSpots] = useState<RestaurantSpot[]>(() => getAllAvailableSpots());

  // Modals
  const [isAddSpotOpen, setIsAddSpotOpen] = useState(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Sync available spots
  const refreshAvailableSpots = useCallback(() => {
    setAvailableSpots(getAllAvailableSpots());
  }, []);

  // Save room updates
  const updateRoomState = useCallback((updatedRoom: VotingRoom | null) => {
    setRoom(updatedRoom);
    saveRoom(updatedRoom);
  }, []);

  // Start new war
  const handleStartWar = ({
    roomName,
    hostName,
    durationSeconds,
  }: {
    roomName: string;
    hostName: string;
    durationSeconds: number;
    initialRadius: number | 'all';
  }) => {
    saveVoterName(hostName);
    setVoterName(hostName);

    const now = Date.now();
    const expiresAt = durationSeconds > 0 ? now + durationSeconds * 1000 : null;

    // Get current available spots pool
    const spotsPool = getAllAvailableSpots().map((s) => ({
      ...s,
      votes: 0,
    }));

    const newRoom: VotingRoom = {
      id: `war-${now}`,
      roomName,
      hostName,
      createdAt: now,
      durationSeconds,
      expiresAt,
      status: 'active',
      spots: spotsPool,
      userVoteId: null,
      voterCount: 0,
    };

    updateRoomState(newRoom);
  };

  // Vote for a spot (immediate update, support changing vote)
  const handleVote = (spotId: string) => {
    if (!room) return;

    const currentVotedId = room.userVoteId;
    let newVotedId: string | null = spotId;
    let voterCountDelta = 0;

    // If tapping the already voted spot, toggle it off
    if (currentVotedId === spotId) {
      newVotedId = null;
      voterCountDelta = -1;
    } else if (currentVotedId === null) {
      voterCountDelta = 1;
    }

    const updatedSpots = room.spots.map((spot) => {
      let v = spot.votes;
      // Withdraw previous vote
      if (currentVotedId && spot.id === currentVotedId) {
        v = Math.max(0, v - 1);
      }
      // Add new vote
      if (newVotedId && spot.id === newVotedId) {
        v = v + 1;
      }
      return { ...spot, votes: v };
    });

    const updatedRoom: VotingRoom = {
      ...room,
      spots: updatedSpots,
      userVoteId: newVotedId,
      voterCount: Math.max(0, room.voterCount + voterCountDelta),
    };

    updateRoomState(updatedRoom);
  };

  // Simulate a friend's vote for rapid testing
  const handleSimulateFriendVote = (spotId: string) => {
    if (!room) return;

    const updatedSpots = room.spots.map((spot) => {
      if (spot.id === spotId) {
        return { ...spot, votes: spot.votes + 1 };
      }
      return spot;
    });

    const updatedRoom: VotingRoom = {
      ...room,
      spots: updatedSpots,
      voterCount: room.voterCount + 1,
    };

    updateRoomState(updatedRoom);
  };

  // Add custom spot
  const handleAddSpot = (newSpotData: Omit<RestaurantSpot, 'id' | 'votes'>) => {
    const createdSpot = addCustomSpot(newSpotData);
    refreshAvailableSpots();

    // If currently in a room, also add to this room's live spots
    if (room) {
      const alreadyInRoom = room.spots.some((s) => s.id === createdSpot.id);
      if (!alreadyInRoom) {
        const updatedRoom: VotingRoom = {
          ...room,
          spots: [createdSpot, ...room.spots],
        };
        updateRoomState(updatedRoom);
      }
    }
  };

  // Bulk add spots
  const handleBulkAddSpots = (newSpotsData: Omit<RestaurantSpot, 'id' | 'votes'>[]) => {
    const createdSpots: RestaurantSpot[] = newSpotsData.map((d, index) => ({
      ...d,
      id: `custom-spot-${Date.now()}-${index}`,
      votes: 0,
    }));

    saveCustomSpots([...createdSpots, ...availableSpots]);
    refreshAvailableSpots();

    if (room) {
      const updatedRoom: VotingRoom = {
        ...room,
        spots: [...createdSpots, ...room.spots],
      };
      updateRoomState(updatedRoom);
    }
  };

  // Load Optional Hyderabad Test Preset (For user testing preview)
  const handleLoadTestPreset = () => {
    saveCustomSpots(OPTIONAL_HYDERABAD_TEST_PRESET);
    refreshAvailableSpots();

    if (room) {
      const updatedRoom: VotingRoom = {
        ...room,
        spots: OPTIONAL_HYDERABAD_TEST_PRESET,
      };
      updateRoomState(updatedRoom);
    }
  };

  // Reset arena
  const handleResetRoom = () => {
    if (window.confirm('Arey ustaad, is war ko cancel karke naye सिरे se shuru karna chahte?')) {
      updateRoomState(null);
    }
  };

  // End voting and reveal winner
  const handleFinishVoting = () => {
    if (!room) return;
    const sorted = [...room.spots].sort((a, b) => b.votes - a.votes);
    const winnerId = sorted[0]?.id || null;

    const finishedRoom: VotingRoom = {
      ...room,
      status: 'ended',
      winnerSpotId: winnerId,
    };

    updateRoomState(finishedRoom);
    setIsWinnerModalOpen(true);
  };

  // Clear everything & test empty state
  const handleResetAllData = () => {
    clearCustomSpots();
    refreshAvailableSpots();
    updateRoomState(null);
  };

  return (
    <div className="min-h-screen bg-[#101014] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <Header
        onNewWar={() => updateRoomState(null)}
        onOpenAddSpot={() => setIsAddSpotOpen(true)}
        onOpenShare={room ? () => setIsShareModalOpen(true) : undefined}
        isInRoom={!!room}
        roomName={room?.roomName}
        onResetRoom={room ? handleResetRoom : undefined}
      />

      {/* Main View: Welcome Screen vs Live Battle Room */}
      <main className="flex-1">
        {!room ? (
          <WelcomeScreen
            onStartWar={handleStartWar}
            existingRoom={getSavedRoom()}
            onResumeWar={() => setRoom(getSavedRoom())}
            availableSpotsCount={availableSpots.length}
            onOpenAddSpot={() => setIsAddSpotOpen(true)}
            onLoadTestPreset={handleLoadTestPreset}
          />
        ) : (
          <VotingRoomView
            room={room}
            onVote={handleVote}
            onSimulateFriendVote={handleSimulateFriendVote}
            onFinishVoting={handleFinishVoting}
            onOpenAddSpot={() => setIsAddSpotOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onLoadTestPreset={handleLoadTestPreset}
            voterName={voterName}
          />
        )}
      </main>

      {/* Modals */}
      <AddSpotModal
        isOpen={isAddSpotOpen}
        onClose={() => setIsAddSpotOpen(false)}
        onAddSpot={handleAddSpot}
        onBulkAddSpots={handleBulkAddSpots}
      />

      {room && (
        <>
          <WinnerRevealModal
            isOpen={isWinnerModalOpen}
            onClose={() => setIsWinnerModalOpen(false)}
            room={room}
            onShareResult={() => {
              setIsWinnerModalOpen(false);
              setIsShareModalOpen(true);
            }}
            onRestartWar={() => {
              setIsWinnerModalOpen(false);
              updateRoomState(null);
            }}
          />

          <ShareSummaryModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            room={room}
          />
        </>
      )}
    </div>
  );
}
