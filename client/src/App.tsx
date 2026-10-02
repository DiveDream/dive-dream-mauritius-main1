import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Redirect, Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteSeo from "./components/RouteSeo";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DiveSafaris from "./pages/DiveSafaris";
import Courses from "./pages/Courses";
import Packages from "./pages/Packages";
import Reservations from "./pages/Reservations";
import ThankYou from "./pages/ThankYou";
import Promotions from "./pages/Promotions";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Crew from "./pages/Crew";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import RebreatherDiving from "./pages/RebreatherDiving";
import LoyaltyClaim from "./pages/LoyaltyClaim";
import OpenWater from "./pages/courses/OpenWater";
import AdvancedOpenWater from "./pages/courses/AdvancedOpenWater";
import RescueDiver from "./pages/courses/RescueDiver";
import ExtendedRange from "./pages/courses/ExtendedRange";
import DeepDiver from "./pages/courses/DeepDiver";
import EnrichedAirNitrox from "./pages/courses/EnrichedAirNitrox";
import WreckDiver from "./pages/courses/WreckDiver";
import DiscoverScubaDiving from "./pages/courses/DiscoverScubaDiving";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dive-safaris" component={DiveSafaris} />
      {/* Old slug. vercel.json/server 301 this too; this covers in-app navigation. */}
      <Route path="/dive-sites">
        <Redirect to="/dive-safaris" />
      </Route>
      <Route path="/courses" component={Courses} />
      <Route path="/packages" component={Packages} />
      <Route path="/reservations" component={Reservations} />
      <Route path="/thank-you" component={ThankYou} />
      <Route path="/promotions" component={Promotions} />
      <Route path="/services" component={Services} />
      <Route path="/services/:id" component={ServiceDetail} />
      <Route path="/crew" component={Crew} />
      <Route path="/faq" component={FAQ} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/rebreather-diving" component={RebreatherDiving} />
      <Route path="/loyalty-claim" component={LoyaltyClaim} />
      <Route path="/courses/open-water" component={OpenWater} />
      <Route path="/courses/advanced-open-water" component={AdvancedOpenWater} />
      <Route path="/courses/rescue-diver" component={RescueDiver} />
      <Route path="/courses/extended-range" component={ExtendedRange} />
      <Route path="/courses/deep-diver" component={DeepDiver} />
      <Route path="/courses/nitrox" component={EnrichedAirNitrox} />
      <Route path="/courses/wreck-diver" component={WreckDiver} />
      <Route path="/courses/discover-scuba-diving" component={DiscoverScubaDiving} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <RouteSeo />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
