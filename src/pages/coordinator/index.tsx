/**
 * Coordinator Module Orchestrator
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Routes requests to the appropriate coordinator sub-page within the Provider and Shell.
 */

import React from "react";
import { useLocation } from "wouter";
import { CoordinatorProvider } from "./coordinator-context";
import { CoordinatorShell } from "./coordinator-shell";
import CoordinatorDashboard from "./dashboard";
import CoordinatorProfile from "./profile";
import CoordinatorRecruitment from "./recruitment";
import CoordinatorApplications from "./applications";
import CoordinatorMembers from "./members";
import CoordinatorTeam from "./team";
import CoordinatorEvents from "./events";
import CoordinatorNews from "./news";
import CoordinatorAchievements from "./achievements";
import CoordinatorFaqs from "./faqs";
import CoordinatorAnalytics from "./analytics";
import CoordinatorApprovals from "./approvals";

export default function CoordinatorHub() {
  const [location] = useLocation();

  const renderView = () => {
    if (location.startsWith("/coordinator/profile") || location.startsWith("/coordinator/pages")) {
      return <CoordinatorProfile />;
    }
    if (location.startsWith("/coordinator/recruitment")) {
      return <CoordinatorRecruitment />;
    }
    if (location.startsWith("/coordinator/applications")) {
      return <CoordinatorApplications />;
    }
    if (location.startsWith("/coordinator/members")) {
      return <CoordinatorMembers />;
    }
    if (location.startsWith("/coordinator/team")) {
      return <CoordinatorTeam />;
    }
    if (location.startsWith("/coordinator/events")) {
      return <CoordinatorEvents />;
    }
    if (location.startsWith("/coordinator/news")) {
      return <CoordinatorNews />;
    }
    if (location.startsWith("/coordinator/achievements") || location.startsWith("/coordinator/gallery")) {
      return <CoordinatorAchievements />;
    }
    if (location.startsWith("/coordinator/faqs") || location.startsWith("/coordinator/contact")) {
      return <CoordinatorFaqs />;
    }
    if (location.startsWith("/coordinator/analytics") || location.startsWith("/coordinator/reports")) {
      return <CoordinatorAnalytics />;
    }
    if (location.startsWith("/coordinator/approvals")) {
      return <CoordinatorApprovals />;
    }

    // Default overview dashboard
    return <CoordinatorDashboard />;
  };

  return (
    <CoordinatorProvider>
      <CoordinatorShell>{renderView()}</CoordinatorShell>
    </CoordinatorProvider>
  );
}
