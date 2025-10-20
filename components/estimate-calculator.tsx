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
    unit: "per tree", defaultQty: 1, hasDebrisCleanup: true, variants: {
      '5ft': { price: 100, originalPrice: 200 },
      '10ft': { price: 220, originalPrice: 370 },
      '15ft': { price: 360, originalPrice: 600 },
      '20ft': { price: 540, originalPrice: 900 },
      '20+ feet': { price: Infinity, originalPrice: Infinity },
    }
  },
  "Tree Removal/Felling": {
    unit: "per tree", defaultQty: 1, hasDebrisCleanup: true, variants: {
      'Up to 10ft': { price: 250, originalPrice: 400 },
      '10ft - 15ft': { price: 450, originalPrice: 700 },
      '15ft+': { price: Infinity, originalPrice: Infinity },
    }
  },
  "Hedge/Shrub Trimming": {
    unit: "linear foot", defaultQty: 50, variants: {
      'Up to 4ft': { price: 0.75, originalPrice: 1.25 },
      '4ft - 6ft': { price: 1.00, originalPrice: 1.75 },
      '6ft - 8ft': { price: 1.50, originalPrice: 2.50 },
      '8ft - 10ft': { price: 2.25, originalPrice: 3.50 },
      '10ft - 12ft': { price: 3.25, originalPrice: 4.75 },
      '12ft - 15ft': { price: 4.50, originalPrice: 6.25 },
      '15ft - 20ft': { price: 6.00, originalPrice: 8.00 },
      '20ft+': { price: Infinity, originalPrice: Infinity },
    }
  },
  "Fall Cleanup": { price: 49, originalPrice: 79, unit: "per hour", defaultQty: 3, },
  "Gutter Cleaning": { price: 90, originalPrice: 150, unit: "per residence", defaultQty: 1, },
  "Garden Maintenance": { price: 48, originalPrice: 80, unit: "per hour", defaultQty: 2, },
  "Landscaping Labour": { price: 57, originalPrice: 95, unit: "per hour", defaultQty: 4, },
  "Aeration": { price: 45, originalPrice: 75, unit: "per lawn", defaultQty: 1, },
  "Dethatching": { price: 60, originalPrice: 100, unit: "per lawn", defaultQty: 1, },
  "Snow Removal": {
    unit: "per clearing", defaultQty: 1, comingSoon: true, variants: {
      'Single Driveway': { price: 399, originalPrice: 599 }, // Seasonal rate
      'Double Driveway': { price: 550, originalPrice: 917 }, // Seasonal rate
      'Single Extended': { price: 450, originalPrice: 750 }, // Seasonal rate
      'Double Extended': { price: 700, originalPrice: 1167 }, // Seasonal rate
      'Driveway + Walkway': { price: 500, originalPrice: 833 }, // Seasonal rate
    }
  },
  "Salting/De-Icing": {
    unit: "per season", defaultQty: 1, comingSoon: true, variants: {
      'Sodium Chloride (Driveway)': { price: 150, originalPrice: 250 },
      'Sodium Chloride (Driveway + Walkway)': { price: 190, originalPrice: 317 },
      'Calcium Chloride (Driveway)': { price: 250, originalPrice: 417 },
      'Calcium Chloride (Driveway + Walkway)': { price: 290, originalPrice: 484 },
      'Magnesium Chloride (Driveway)': { price: 250, originalPrice: 417 },
      'Magnesium Chloride (Driveway + Walkway)': { price: 290, originalPrice: 484 },
    }
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
        if (service.variant === '5ft') return service.quantity * 0.5;
        if (service.variant === '10ft') return service.quantity * 1;
        if (service.variant === '15ft') return service.quantity * 2;
        if (service.variant === '20ft') return service.quantity * 3;
      }
      return service.quantity * 1.5; // default estimate

    case "Tree Removal/Felling":
      if (service.variant) {
        if (service.variant === 'Up to 10ft') return service.quantity * 2;
        if (service.variant === '10ft - 15ft') return service.quantity * 4;
      }
      return service.quantity * 3; // default estimate

    case "Hedge/Shrub Trimming":
      // Estimate based on linear feet (roughly 20-30 feet per hour depending on height)
      const feetPerHour = service.variant?.includes('10ft') || service.variant?.includes('12ft') ||
                          service.variant?.includes('15ft') || service.variant?.includes('20ft')
                          ? 15 : 25;
      return Math.max(1, Math.ceil(service.quantity / feetPerHour));

    case "Gutter Cleaning":
      return 1.5 * service.quantity;

    case "Aeration":
      return 1.5 * service.quantity;

    case "Dethatching":
      return 2 * service.quantity;

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
}: {
  onClose: () => void;
  onBookService: (services: Service[], estimatedHours: number) => void;
  onScheduleConsultation: () => void;
}) {
  const [services, setServices] = useState<Service[]>([{
    name: "",
    quantity: 1,
    unit: "",
  }]);

  const addService = () => {
    setServices([
      ...services,
      { name: "", quantity: 1, unit: "" },
    ]);
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
          variant: serviceDetails[newName].variants ? Object.keys(serviceDetails[newName].variants!)[0] : undefined,
          debrisCleanup: serviceDetails[newName].hasDebrisCleanup ? true : undefined,
        };
      } else {
        updatedServices[index] = { ...updatedServices[index], [field]: newName };
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
      basePrice = (details.variants[service.variant]?.price || 0) * service.quantity;
    } else {
      basePrice = (details.price || 0) * service.quantity;
    }

    if (service.debrisCleanup) {
      return basePrice * 1.20; // Add 20% for debris cleanup
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

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Estimate", 105, 15, { align: "center" });

    doc.setFontSize(12);
    let yPos = 30;
    services.forEach((service) => {
      const price = calculateServicePrice(service);
      doc.text(
        `${service.name}: $${price.toFixed(2)} (${service.quantity} ${
          service.unit
        })`,
        20,
        yPos,
      );
      yPos += 10;
    });

    doc.setFontSize(16);
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, 20, yPos + 10);

    doc.save("estimate.pdf");
  };

  // Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
      />
      <Card className="w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
      <CardHeader className="relative">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-2xl font-bold">
            Estimate Calculator
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="ghost" size="sm">
              <Printer className="w-4 h-4" />
            </Button>
            <Button onClick={handleDownload} variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {services.map((service, index) => (
          <div key={index} className="mb-6 p-4 border rounded">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`service-${index}`}>Service</Label>
                <Select
                  value={service.name}
                  onValueChange={(value) => updateService(index, "name", value)}
                >
                  <SelectTrigger id={`service-${index}`}>
                    <SelectValue placeholder="Please select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(serviceDetails).filter(key => key !== "").map(serviceName => {
                      const details = serviceDetails[serviceName as ServiceType];
                      return (
                      <SelectItem key={serviceName} value={serviceName} disabled={details.consultationOnly || details.comingSoon}>
                        {details.consultationOnly ? (
                          <span className="line-through text-gray-500">{`${serviceName} (Consultation required)`}</span>
                        ) : details.comingSoon ? (
                          <span className="text-gray-500">{`${serviceName} (Coming Soon)`}</span>
                        ) : (
                          serviceName
                        )}
                      </SelectItem>
                      )
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
                    <SelectTrigger id={`variant-${index}`}>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(serviceDetails[service.name].variants!).map(variant => (
                        <SelectItem key={variant} value={variant} disabled={variant.includes('+')}>
                          {variant.includes('+') ? `${variant} (Consultation required)` : variant}
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
                  />
                </div>
              )}
              {service.name && serviceDetails[service.name]?.hasDebrisCleanup && (
                <div className="flex items-center pt-6 space-x-2">
                  <Input
                    type="checkbox"
                    id={`debris-${index}`}
                    checked={!!service.debrisCleanup}
                    onChange={(e) =>
                      updateService(index, "debrisCleanup", e.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`debris-${index}`} className="text-sm font-medium">Debris Cleanup (+20%)</Label>
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
                    originalPrice = details.variants[service.variant]?.originalPrice || 0;
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
        <Button onClick={addService} size="sm" className="mt-4">
          + Add Service
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <div className="text-xl font-bold mb-4">
          Total Estimate: ${calculateTotal().toFixed(2)}
        </div>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => {
              const validServices = services.filter((s): s is Service & { name: Exclude<ServiceType, ""> } => s.name !== "");
              const estimatedHours = calculateTotalEstimatedHours(validServices);
              onBookService(validServices, estimatedHours);
            }}
            variant="default"
            className="flex-1 bg-nature-500 hover:bg-nature-600 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Service Now
          </Button>
          <Button
            onClick={onScheduleConsultation}
            variant="outline"
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Consultation
          </Button>
        </div>
      </CardFooter>
    </Card>
    </div>
  );
}
