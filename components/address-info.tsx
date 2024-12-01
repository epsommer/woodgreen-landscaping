"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function AddressInfo() {
  return (
    <Card className="bg-white dark:bg-[#2F3B30] border-0">
      <CardHeader>
        <CardTitle>Our Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-2">
          <MapPin className="w-5 h-5 mt-1 text-[#CEFF65]" />
          <div>
            <p className="font-semibold">Address:</p>
            <p>84 Newton Drive</p>
            <p>Toronto, ON M2M 2M9</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-[#CEFF65]" />
          <p>(647) 327-8401</p>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-[#CEFF65]" />
          <p>info@woodgreenlandscaping.com</p>
        </div>
        <div className="flex items-start space-x-2">
          <Clock className="w-5 h-5 mt-1 text-[#CEFF65]" />
          <div>
            <p className="font-semibold">Business Hours:</p>
            <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p>Saturday: 9:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

