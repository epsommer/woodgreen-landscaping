"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Minus, Calendar } from "lucide-react";
import Scheduler from "./scheduler";

interface Service {
  id: string;
  name: string;
  quantity: number;
  rate: number;
}

const serviceOptions = [
  { name: "Basic Maintenance", rate: 2, unit: "sq ft" },
  { name: "Premium Care", rate: 3, unit: "sq ft" },
  { name: "Deluxe Package", rate: 4, unit: "sq ft" },
  { name: "Lawn Mowing", rate: 1.5, unit: "sq ft" },
  { name: "Tree Trimming", rate: 50, unit: "tree" },
  { name: "Flower Planting", rate: 2.5, unit: "sq ft" },
];

export function EstimateCalculator() {
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);

  const selectedService = serviceOptions.find((s) => s.name === currentService);

  const addService = () => {
    if (currentService && currentQuantity && selectedService) {
      const newService: Service = {
        id: Date.now().toString(),
        name: currentService,
        quantity: parseFloat(currentQuantity),
        rate: selectedService.rate,
      };
      setServices([...services, newService]);
      setCurrentService("");
      setCurrentQuantity("");
    }
  };

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const calculateTotal = () => {
    return services.reduce(
      (sum, service) => sum + service.quantity * service.rate,
      0,
    );
  };

  const closeModal = () => {
    setShowScheduler(false);
  };

  if (showScheduler) {
    return <Scheduler onClose={closeModal} initialService={currentService} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Estimate Calculator</h2>
            <Button variant="ghost" size="icon" onClick={closeModal}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <Label htmlFor="service">Service Type</Label>
                <Select
                  value={currentService}
                  onValueChange={setCurrentService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map((option) => (
                      <SelectItem key={option.name} value={option.name}>
                        {option.name} (${option.rate}/{option.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">
                  {selectedService?.name === "Tree Trimming" ? "Trees" : "Area"}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder={
                    selectedService?.name === "Tree Trimming"
                      ? "Trees"
                      : "sq ft"
                  }
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={addService}
              className="w-full"
              disabled={!currentService || !currentQuantity}
              size="sm"
            >
              <Plus className="h-3 w-3 mr-2" />
              Add Service
            </Button>
            {services.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="font-semibold">Selected Services:</h3>
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded text-sm"
                  >
                    <span>
                      {service.name} - {service.quantity}{" "}
                      {
                        serviceOptions.find((s) => s.name === service.name)
                          ?.unit
                      }
                    </span>
                    <div className="flex items-center">
                      <span className="mr-2">
                        ${(service.quantity * service.rate).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(service.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {services.length > 0 && (
              <div className="mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-lg font-semibold">
                  Total Estimate: ${calculateTotal().toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  This is a rough estimate. Schedule a consultation for a
                  detailed quote.
                </p>
              </div>
            )}
            <Button
              onClick={() => setShowScheduler(true)}
              className="w-full"
              variant="outline"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EstimateCalculator;
