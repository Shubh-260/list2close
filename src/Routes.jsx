import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import Register from "pages/register";
import CommunicationsHub from "pages/communications-hub";
import LeadManagement from "pages/lead-management";
import PropertyListings from "pages/property-listings";
import CalendarScheduling from "pages/calendar-scheduling";
import TransactionManagement from "pages/transaction-management";
import OfferManagement from "pages/offer-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/communications-hub" element={<CommunicationsHub />} />
        <Route path="/lead-management" element={<LeadManagement />} />
        <Route path="/property-listings" element={<PropertyListings />} />
        <Route path="/calendar-scheduling" element={<CalendarScheduling />} />
        <Route path="/transaction-management" element={<TransactionManagement />} />
        <Route path="/offer-management" element={<OfferManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;