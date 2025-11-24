"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer, Download, Calendar, X, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import Image from "next/image";

type ServiceType =
  | ""
  | "Tree Trimming"
  | "Hedge/Shrub Trimming"
  | "Fall Cleanup"
  | "Gutter Cleaning"
  | "Garden Maintenance"
  | "Landscaping Labour"
  | "Aeration"
  | "Dethatching"
  | "Grass Cutting"
  | "Snow Removal" // Keep as regular service
  | "Salting/De-Icing" // New service
  | "Tree Removal/Felling";

export type Service = {
  name: ServiceType;
  quantity: number;
  unit: string;
  variant?: string;
  debrisCleanup?: boolean;
};

type ServiceDetail = {
  price?: number;
  originalPrice?: number;
  unit: string;
  defaultQty: number;
  variants?: Record<string, { price: number; originalPrice: number }>;
  hasDebrisCleanup?: boolean;
  consultationOnly?: boolean;
  comingSoon?: boolean;
};

const serviceDetails: Record<ServiceType, ServiceDetail> = {
  "": { unit: "", defaultQty: 1 },
  "Tree Trimming": {
    unit: "per tree",
    defaultQty: 1,
    hasDebrisCleanup: true,
    variants: {
      "5ft": { price: 100, originalPrice: 200 },
      "10ft": { price: 220, originalPrice: 370 },
      "15ft": { price: 360, originalPrice: 600 },
      "20ft": { price: 540, originalPrice: 900 },
      "20+ feet": { price: Infinity, originalPrice: Infinity },
    },
  },
  "Tree Removal/Felling": {
    unit: "per tree",
    defaultQty: 1,
    hasDebrisCleanup: true,
    variants: {
      "Up to 10ft": { price: 250, originalPrice: 400 },
      "10ft - 15ft": { price: 450, originalPrice: 700 },
      "15ft+": { price: Infinity, originalPrice: Infinity },
    },
  },
  "Hedge/Shrub Trimming": {
    unit: "linear foot",
    defaultQty: 50,
    variants: {
      "Up to 4ft": { price: 0.75, originalPrice: 1.25 },
      "4ft - 6ft": { price: 1.0, originalPrice: 1.75 },
      "6ft - 8ft": { price: 1.5, originalPrice: 2.5 },
      "8ft - 10ft": { price: 2.25, originalPrice: 3.5 },
      "10ft - 12ft": { price: 3.25, originalPrice: 4.75 },
      "12ft - 15ft": { price: 4.5, originalPrice: 6.25 },
      "15ft - 20ft": { price: 6.0, originalPrice: 8.0 },
      "20ft+": { price: Infinity, originalPrice: Infinity },
    },
  },
  "Fall Cleanup": {
    price: 49,
    originalPrice: 79,
    unit: "per hour",
    defaultQty: 3,
  },
  "Gutter Cleaning": {
    price: 90,
    originalPrice: 150,
    unit: "per residence",
    defaultQty: 1,
  },
  "Garden Maintenance": {
    price: 48,
    originalPrice: 80,
    unit: "per hour",
    defaultQty: 2,
  },
  "Landscaping Labour": {
    price: 57,
    originalPrice: 95,
    unit: "per hour",
    defaultQty: 4,
  },
  Aeration: { price: 45, originalPrice: 75, unit: "per lawn", defaultQty: 1 },
  Dethatching: {
    price: 60,
    originalPrice: 100,
    unit: "per lawn",
    defaultQty: 1,
  },
  "Grass Cutting": {
    price: 49,
    originalPrice: 55,
    unit: "per cut",
    defaultQty: 1,
  },
  "Snow Removal": {
    unit: "per clearing",
    defaultQty: 1,
    comingSoon: true,
    variants: {
      "Single Driveway": { price: 399, originalPrice: 599 }, // Seasonal rate
      "Double Driveway": { price: 550, originalPrice: 917 }, // Seasonal rate
      "Single Extended": { price: 450, originalPrice: 750 }, // Seasonal rate
      "Double Extended": { price: 700, originalPrice: 1167 }, // Seasonal rate
      "Driveway + Walkway": { price: 500, originalPrice: 833 }, // Seasonal rate
    },
  },
  "Salting/De-Icing": {
    unit: "per season",
    defaultQty: 1,
    comingSoon: true,
    variants: {
      "Sodium Chloride (Driveway)": { price: 150, originalPrice: 250 },
      "Sodium Chloride (Driveway + Walkway)": {
        price: 190,
        originalPrice: 317,
      },
      "Calcium Chloride (Driveway)": { price: 250, originalPrice: 417 },
      "Calcium Chloride (Driveway + Walkway)": {
        price: 290,
        originalPrice: 484,
      },
      "Magnesium Chloride (Driveway)": { price: 250, originalPrice: 417 },
      "Magnesium Chloride (Driveway + Walkway)": {
        price: 290,
        originalPrice: 484,
      },
    },
  },
};

// Calculate estimated hours for a service
export const calculateEstimatedHours = (service: Service): number => {
  if (!service.name || !serviceDetails[service.name]) {
    return 0;
  }

  const details = serviceDetails[service.name];

  // Services already measured in hours
  if (details.unit === "per hour") {
    return service.quantity;
  }

  // Estimate hours for other services
  switch (service.name) {
    case "Tree Trimming":
      // Estimate based on tree size and quantity
      if (service.variant) {
        if (service.variant === "5ft") return service.quantity * 0.5;
        if (service.variant === "10ft") return service.quantity * 1;
        if (service.variant === "15ft") return service.quantity * 2;
        if (service.variant === "20ft") return service.quantity * 3;
      }
      return service.quantity * 1.5; // default estimate

    case "Tree Removal/Felling":
      if (service.variant) {
        if (service.variant === "Up to 10ft") return service.quantity * 2;
        if (service.variant === "10ft - 15ft") return service.quantity * 4;
      }
      return service.quantity * 3; // default estimate

    case "Hedge/Shrub Trimming":
      // Estimate based on linear feet (roughly 20-30 feet per hour depending on height)
      const feetPerHour =
        service.variant?.includes("10ft") ||
        service.variant?.includes("12ft") ||
        service.variant?.includes("15ft") ||
        service.variant?.includes("20ft")
          ? 15
          : 25;
      return Math.max(1, Math.ceil(service.quantity / feetPerHour));

    case "Gutter Cleaning":
      return 1.5 * service.quantity;

    case "Aeration":
      return 1.5 * service.quantity;

    case "Dethatching":
      return 2 * service.quantity;

    case "Grass Cutting":
      return 1 * service.quantity;

    case "Snow Removal":
    case "Salting/De-Icing":
      // These are seasonal/on-demand services, not appointment-based
      return 0;

    default:
      return 1; // default 1 hour for unknown services
  }
};

// Calculate total estimated hours for all services
export const calculateTotalEstimatedHours = (services: Service[]): number => {
  return services.reduce((total, service) => {
    const hours = calculateEstimatedHours(service);
    // Add 20% more time if debris cleanup is requested
    return total + (service.debrisCleanup ? hours * 1.2 : hours);
  }, 0);
};

export function EstimateCalculator({
  onClose,
  onBookService,
  onScheduleConsultation,
  initialService,
}: {
  onClose: () => void;
  onBookService: (services: Service[], estimatedHours: number) => void;
  onScheduleConsultation: (services: Service[], estimatedHours: number) => void;
  initialService?: string;
}) {
  const [services, setServices] = useState<Service[]>(() => {
    if (initialService && serviceDetails[initialService as ServiceType]) {
      const details = serviceDetails[initialService as ServiceType];
      return [
        {
          name: initialService as ServiceType,
          quantity: details.defaultQty,
          unit: details.unit,
          variant: details.variants
            ? Object.keys(details.variants)[0]
            : undefined,
          debrisCleanup: details.hasDebrisCleanup ? true : undefined,
        },
      ];
    }
    return [
      {
        name: "",
        quantity: 1,
        unit: "",
      },
    ];
  });

  const addService = () => {
    setServices([...services, { name: "", quantity: 1, unit: "" }]);
  };

  const updateService = (
    index: number,
    field: keyof Service,
    value: string | number | boolean,
  ) => {
    const updatedServices = [...services];
    if (field === "name") {
      const newName = value as ServiceType;
      if (newName && serviceDetails[newName]) {
        updatedServices[index] = {
          ...updatedServices[index],
          [field]: newName,
          unit: serviceDetails[newName].unit,
          quantity: serviceDetails[newName].defaultQty,
          variant: serviceDetails[newName].variants
            ? Object.keys(serviceDetails[newName].variants!)[0]
            : undefined,
          debrisCleanup: serviceDetails[newName].hasDebrisCleanup
            ? true
            : undefined,
        };
      } else {
        updatedServices[index] = {
          ...updatedServices[index],
          [field]: newName,
        };
      }
    } else {
      updatedServices[index] = { ...updatedServices[index], [field]: value };
    }
    setServices(updatedServices);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const calculateServicePrice = (service: Service) => {
    if (!service.name || !serviceDetails[service.name]) {
      return 0;
    }

    const details = serviceDetails[service.name];
    let basePrice = 0;
    if (details.variants && service.variant) {
      basePrice =
        (details.variants[service.variant]?.price || 0) * service.quantity;
    } else {
      basePrice = (details.price || 0) * service.quantity;
    }

    if (service.debrisCleanup) {
      return basePrice * 1.2; // Add 20% for debris cleanup
    }
    return basePrice;
  };

  const calculateTotal = () => {
    return services.reduce(
      (total, service) => total + calculateServicePrice(service),
      0,
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Brand colors
    const darkGreen = [47, 59, 48]; // rgb(47, 59, 48) - header background
    const brandGreen = [206, 255, 101]; // rgb(206, 255, 101) - accent/brand color
    const lightText = [255, 255, 255]; // white text for header
    const lightGray = [243, 244, 246];
    const darkGray = [75, 85, 99];

    // Header background - increased height for logo
    doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.rect(0, 0, pageWidth, 55, "F");

    // Add logo
    try {
      // Load the logo from the public folder
      const logoResponse = await fetch(
        "/woodgreen-landscaping-logo-palmette-inverse.svg",
      );
      const logoSvg = await logoResponse.text();

      // Convert SVG to base64 data URL for embedding
      const logoBase64 = btoa(unescape(encodeURIComponent(logoSvg)));
      const logoDataUrl = `data:image/svg+xml;base64,${logoBase64}`;

      // Add logo to PDF (centered, 30mm width)
      const logoWidth = 30;
      const logoHeight = 30;
      const logoX = (pageWidth - logoWidth) / 2;
      doc.addImage(logoDataUrl, "SVG", logoX, 8, logoWidth, logoHeight);
    } catch (error) {
      console.error("Failed to load logo:", error);
      // Fallback to text if logo fails to load
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("WOODGREEN LANDSCAPING", pageWidth / 2, 25, { align: "center" });
    }

    // Contact info in header
    doc.setTextColor(lightText[0], lightText[1], lightText[2]);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "(647) 327-8401  •  info@woodgreenlandscaping.com  •  Toronto, ON",
      pageWidth / 2,
      48,
      { align: "center" },
    );

    // Document title
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("SERVICE ESTIMATE", 20, 70);

    // Date and estimate number
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const estimateNumber = `EST-${Date.now().toString().slice(-8)}`;
    doc.text(`Date: ${currentDate}`, pageWidth - 20, 70, { align: "right" });
    doc.text(`Estimate #: ${estimateNumber}`, pageWidth - 20, 76, {
      align: "right",
    });

    // Services section
    let yPos = 95;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text("SERVICES", 20, yPos);

    // Table header
    yPos += 8;
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(20, yPos - 5, pageWidth - 40, 8, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Service Description", 25, yPos);
    doc.text("Qty", pageWidth - 95, yPos);
    doc.text("Unit", pageWidth - 70, yPos);
    doc.text("Amount", pageWidth - 25, yPos, { align: "right" });

    // Service items
    yPos += 10;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    services.forEach((service) => {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      const price = calculateServicePrice(service);

      // Service name
      let serviceName = service.name;
      if (service.variant) {
        serviceName += ` (${service.variant})`;
      }
      if (service.debrisCleanup) {
        serviceName += " + Debris Cleanup";
      }

      doc.setFontSize(9);
      doc.text(serviceName, 25, yPos);
      doc.text(service.quantity.toString(), pageWidth - 95, yPos);
      doc.text(service.unit, pageWidth - 70, yPos);
      doc.text(`$${price.toFixed(2)}`, pageWidth - 25, yPos, {
        align: "right",
      });

      yPos += 7;
    });

    // Subtotal and total section
    yPos += 5;
    doc.setDrawColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);

    yPos += 10;
    const total = calculateTotal();

    // Total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text("TOTAL ESTIMATE:", pageWidth - 80, yPos);
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text(`$${total.toFixed(2)}`, pageWidth - 25, yPos, { align: "right" });

    // Notes section
    yPos += 20;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text("IMPORTANT NOTES:", 20, yPos);

    yPos += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    const notes = [
      "• This estimate is valid for 30 days from the date of issue.",
      "• Final pricing may vary based on site conditions and accessibility.",
      "• All services are subject to our standard terms and conditions.",
      "• Seasonal services are weather-dependent and scheduled accordingly.",
    ];

    notes.forEach((note) => {
      doc.text(note, 20, yPos);
      yPos += 5;
    });

    // Thank you section
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text(
      "Thank you for considering Woodgreen Landscaping!",
      pageWidth / 2,
      yPos,
      { align: "center" },
    );

    yPos += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(
      "We look forward to bringing your landscape vision to life.",
      pageWidth / 2,
      yPos,
      { align: "center" },
    );

    // Footer
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(0, pageHeight - 20, pageWidth, 20, "F");

    doc.setFontSize(8);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(
      "Woodgreen Landscaping  •  Toronto, ON",
      pageWidth / 2,
      pageHeight - 12,
      { align: "center" },
    );
    doc.text(
      "(647) 327-8401  •  info@woodgreenlandscaping.com",
      pageWidth / 2,
      pageHeight - 7,
      { align: "center" },
    );

    doc.save(`woodgreen-estimate-${estimateNumber}.pdf`);
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div>
      {/* Print-only branded estimate */}
      <div className="hidden print:block print-estimate">
        {/* Header */}
        <div className="bg-[rgb(47,59,48)] text-white p-6 mb-6 -mx-10 -mt-10">
          <div className="flex items-center justify-center mb-3">
            <Image
              src="/woodgreen-landscaping-logo-palmette-inverse.svg"
              alt="Woodgreen Landscaping Logo"
              width={120}
              height={120}
              className="h-auto print:block"
              style={{
                maxWidth: "120px",
                height: "auto",
              }}
            />
          </div>
          <p className="text-center text-xs">
            (647) 327-8401 • info@woodgreenlandscaping.com • Toronto, ON
          </p>
        </div>

        {/* Document info */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[rgb(47,59,48)] mb-2">
              SERVICE ESTIMATE
            </h2>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>
              Date:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>Estimate #: EST-{Date.now().toString().slice(-8)}</p>
          </div>
        </div>

        {/* Services table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-[rgb(47,59,48)] mb-3">
            SERVICES
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-sm">
                <th className="text-left p-2 border-b-2 border-[rgb(47,59,48)]">
                  Service Description
                </th>
                <th className="text-center p-2 border-b-2 border-[rgb(47,59,48)]">
                  Qty
                </th>
                <th className="text-center p-2 border-b-2 border-[rgb(47,59,48)]">
                  Unit
                </th>
                <th className="text-right p-2 border-b-2 border-[rgb(47,59,48)]">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => {
                if (!service.name) return null;
                const price = calculateServicePrice(service);
                let serviceName = service.name;
                if (service.variant) serviceName += ` (${service.variant})`;
                if (service.debrisCleanup) serviceName += " + Debris Cleanup";

                return (
                  <tr key={index} className="border-b">
                    <td className="p-2 text-sm">{serviceName}</td>
                    <td className="p-2 text-center text-sm">
                      {service.quantity}
                    </td>
                    <td className="p-2 text-center text-sm">{service.unit}</td>
                    <td className="p-2 text-right text-sm">
                      ${price.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="text-right">
            <div className="flex justify-between gap-8 items-center border-t-2 border-[rgb(47,59,48)] pt-3">
              <span className="text-lg font-bold text-[rgb(47,59,48)]">
                TOTAL ESTIMATE:
              </span>
              <span className="text-2xl font-bold text-[rgb(47,59,48)]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <h4 className="text-sm font-bold text-[rgb(47,59,48)] mb-2">
            IMPORTANT NOTES:
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>
              • This estimate is valid for 30 days from the date of issue.
            </li>
            <li>
              • Final pricing may vary based on site conditions and
              accessibility.
            </li>
            <li>
              • All services are subject to our standard terms and conditions.
            </li>
            <li>
              • Seasonal services are weather-dependent and scheduled
              accordingly.
            </li>
          </ul>
        </div>

        {/* Thank you */}
        <div className="text-center mb-8">
          <p className="text-base font-bold text-[rgb(47,59,48)] mb-1">
            Thank you for considering Woodgreen Landscaping!
          </p>
          <p className="text-sm text-gray-600">
            We look forward to bringing your landscape vision to life.
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-10 left-0 right-0 bg-gray-100 p-4 text-center text-xs text-gray-600">
          <p>Woodgreen Landscaping • Toronto, ON</p>
          <p>(647) 327-8401 • info@woodgreenlandscaping.com</p>
        </div>
      </div>

      <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm no-print">
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-label="Close modal"
        />
        <Card className="w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto bg-white dark:bg-[rgb(47,59,48)] border-nature-200 dark:border-nature-900">
          <CardHeader className="relative bg-gradient-to-br from-nature-50 to-white dark:from-[rgb(47,59,48)] dark:to-[rgb(47,59,48)]">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-2xl font-bold text-nature-800 dark:text-nature-100">
                Estimate Calculator
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handlePrint}
                  variant="ghost"
                  size="sm"
                  className="text-[rgb(47,59,48)] hover:text-[rgb(47,59,48)] dark:text-[rgb(206,255,101)] dark:hover:text-[rgb(206,255,101)] hover:bg-nature-100 dark:hover:bg-nature-900/50"
                >
                  <Printer className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="ghost"
                  size="sm"
                  className="text-[rgb(47,59,48)] hover:text-[rgb(47,59,48)] dark:text-[rgb(206,255,101)] dark:hover:text-[rgb(206,255,101)] hover:bg-nature-100 dark:hover:bg-nature-900/50"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-[rgb(47,59,48)] hover:text-[rgb(47,59,48)] dark:text-[rgb(206,255,101)] dark:hover:text-[rgb(206,255,101)] hover:bg-nature-100 dark:hover:bg-nature-900/50"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="bg-gradient-to-b from-white to-nature-50/30 dark:from-[rgb(47,59,48)] dark:to-[rgb(47,59,48)]">
            {services.map((service, index) => (
              <div
                key={index}
                className="mb-6 p-4 border border-nature-200 dark:border-nature-800 rounded-lg bg-white dark:bg-[rgb(47,59,48)] shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(30,60,30,0.2)]"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label
                      htmlFor={`service-${index}`}
                      className="text-[rgb(47,59,48)] dark:text-[rgb(206,255,101)] font-semibold"
                    >
                      Service
                    </Label>
                    <Select
                      value={service.name}
                      onValueChange={(value) =>
                        updateService(index, "name", value)
                      }
                    >
                      <SelectTrigger
                        id={`service-${index}`}
                        className="border-2 border-[rgb(206,255,101)] focus:ring-[rgb(206,255,101)] focus:border-[rgb(206,255,101)] bg-white dark:bg-[rgb(47,59,48)]"
                      >
                        <SelectValue placeholder="Please select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(serviceDetails)
                          .filter((key) => key !== "")
                          .map((serviceName) => {
                            const details =
                              serviceDetails[serviceName as ServiceType];
                            return (
                              <SelectItem
                                key={serviceName}
                                value={serviceName}
                                disabled={
                                  details.consultationOnly || details.comingSoon
                                }
                              >
                                {details.consultationOnly ? (
                                  <span className="line-through text-gray-500">{`${serviceName} (Consultation required)`}</span>
                                ) : details.comingSoon ? (
                                  <span className="text-gray-500">{`${serviceName} (Coming Soon)`}</span>
                                ) : (
                                  serviceName
                                )}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                  {service.name && serviceDetails[service.name]?.variants && (
                    <div>
                      <Label htmlFor={`variant-${index}`}>Options</Label>
                      <Select
                        value={service.variant}
                        onValueChange={(value) =>
                          updateService(index, "variant", value)
                        }
                      >
                        <SelectTrigger
                          id={`variant-${index}`}
                          className="border-gray-300 dark:border-gray-600"
                        >
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(
                            serviceDetails[service.name].variants!,
                          ).map((variant) => (
                            <SelectItem
                              key={variant}
                              value={variant}
                              disabled={variant.includes("+")}
                            >
                              {variant.includes("+")
                                ? `${variant} (Consultation required)`
                                : variant}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {service.name && (
                    <div>
                      <Label
                        htmlFor={`quantity-${index}`}
                      >{`Quantity (${service.unit})`}</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        value={service.quantity}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value, 10) || 0;
                          updateService(index, "quantity", quantity);
                        }}
                        className="border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                  {service.name &&
                    serviceDetails[service.name]?.hasDebrisCleanup && (
                      <div className="flex items-center pt-6 space-x-2">
                        <Input
                          type="checkbox"
                          id={`debris-${index}`}
                          checked={!!service.debrisCleanup}
                          onChange={(e) =>
                            updateService(
                              index,
                              "debrisCleanup",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4"
                        />
                        <Label
                          htmlFor={`debris-${index}`}
                          className="text-sm font-medium"
                        >
                          Debris Cleanup (+20%)
                        </Label>
                      </div>
                    )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">
                    Price: ${calculateServicePrice(service).toFixed(2)}
                    {(() => {
                      if (!service.name || !serviceDetails[service.name]) {
                        return null;
                      }

                      const details = serviceDetails[service.name];
                      let originalPrice = 0;
                      if (details.variants && service.variant) {
                        originalPrice =
                          details.variants[service.variant]?.originalPrice || 0;
                      } else if (details.originalPrice) {
                        originalPrice = details.originalPrice;
                      }

                      if (originalPrice > 0 && isFinite(originalPrice)) {
                        return (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${(originalPrice * service.quantity).toFixed(2)}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                    className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                    aria-label={`Remove ${service.name}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={addService}
              size="sm"
              className="mt-4 bg-[rgb(206,255,101)] hover:bg-[rgb(186,235,81)] text-[rgb(47,59,48)] shadow-[2px_2px_5px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.3),-2px_-2px_5px_rgba(30,60,30,0.2)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] transition-all"
            >
              + Add Service
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch bg-gradient-to-t from-nature-50/50 to-white dark:from-[rgb(47,59,48)] dark:to-[rgb(47,59,48)]">
            <div className="text-2xl font-bold mb-4 text-nature-800 dark:text-nature-100 p-4 bg-white dark:bg-[rgb(47,59,48)] rounded-lg shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3),inset_-2px_-2px_5px_rgba(30,60,30,0.2)]">
              Total Estimate:{" "}
              <span className="text-[rgb(47,59,48)] dark:text-[rgb(206,255,101)]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  const validServices = services.filter(
                    (s): s is Service & { name: Exclude<ServiceType, ""> } =>
                      s.name !== "",
                  );
                  const estimatedHours =
                    calculateTotalEstimatedHours(validServices);
                  onBookService(validServices, estimatedHours);
                }}
                variant="default"
                className="flex-1 bg-[rgb(206,255,101)] hover:bg-[rgb(186,235,81)] text-[rgb(47,59,48)] shadow-[4px_4px_10px_rgba(0,0,0,0.15),-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.4),-2px_-2px_6px_rgba(30,60,30,0.2)] hover:shadow-[2px_2px_8px_rgba(0,0,0,0.2)] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)] transition-all font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Service Now
              </Button>
              <Button
                onClick={() => {
                  const validServices = services.filter(
                    (s): s is Service & { name: Exclude<ServiceType, ""> } =>
                      s.name !== "",
                  );
                  const estimatedHours =
                    calculateTotalEstimatedHours(validServices);
                  onScheduleConsultation(validServices, estimatedHours);
                }}
                variant="outline"
                className="flex-1 border-2 border-[rgb(206,255,101)] text-[rgb(47,59,48)] dark:text-[rgb(206,255,101)] hover:bg-nature-50 dark:hover:bg-nature-900/30 shadow-[2px_2px_6px_rgba(0,0,0,0.1),-2px_-2px_6px_rgba(255,255,255,0.7)] dark:shadow-[2px_2px_6px_rgba(0,0,0,0.3),-2px_-2px_6px_rgba(30,60,30,0.2)] hover:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1)] transition-all font-semibold"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
