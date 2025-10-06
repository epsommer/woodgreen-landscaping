"use client";

import { useState } from "react";
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
  | "Grass Cutting"
  | "Tree Trimming"
  | "Snow Removal"
  | "Leaf Removal"
  | "Gutter Cleaning";

type Service = {
  name: ServiceType;
  quantity: number;
  unit: string;
};

const serviceDetails: Record<ServiceType, { price: number; unit: string }> = {
  "Grass Cutting": { price: 0.1, unit: "sq ft" },
  "Tree Trimming": { price: 50, unit: "per tree" },
  "Snow Removal": { price: 100, unit: "per residence" },
  "Leaf Removal": { price: 75, unit: "per hour" },
  "Gutter Cleaning": { price: 2, unit: "per linear foot" },
};

export function EstimateCalculator({
  onClose,
  onScheduleConsultation,
}: {
  onClose: () => void;
  onScheduleConsultation: () => void;
}) {
  const [services, setServices] = useState<Service[]>([
    { name: "Grass Cutting", quantity: 1000, unit: "sq ft" },
  ]);

  const addService = () => {
    setServices([
      ...services,
      { name: "Grass Cutting", quantity: 1, unit: "sq ft" },
    ]);
  };

  const updateService = (
    index: number,
    field: keyof Service,
    value: string | number,
  ) => {
    const updatedServices = [...services];
    if (field === "name") {
      const newName = value as ServiceType;
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: newName,
        unit: serviceDetails[newName].unit,
      };
    } else {
      updatedServices[index] = { ...updatedServices[index], [field]: value };
    }
    setServices(updatedServices);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const calculateServicePrice = (service: Service) => {
    const { price } = serviceDetails[service.name];
    return price * service.quantity;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(serviceDetails).map((serviceName) => (
                      <SelectItem key={serviceName} value={serviceName}>
                        {serviceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor={`quantity-${index}`}
                >{`Quantity (${service.unit})`}</Label>
                <Input
                  id={`quantity-${index}`}
                  type="number"
                  value={service.quantity}
                  onChange={(e) =>
                    updateService(index, "quantity", parseInt(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">
                Price: ${calculateServicePrice(service).toFixed(2)}
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
            onClick={onScheduleConsultation}
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

