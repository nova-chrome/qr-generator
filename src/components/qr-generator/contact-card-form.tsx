"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { ContactData } from "~/lib/qr-utils";

interface ContactCardFormProps {
  contactData: ContactData;
  onContactDataChange: (contactData: ContactData) => void;
}

export function ContactCardForm({
  contactData,
  onContactDataChange,
}: ContactCardFormProps) {
  const updateContactData = (field: keyof ContactData, value: string) => {
    onContactDataChange({
      ...contactData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={contactData.firstName}
            onChange={(e) => updateContactData("firstName", e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={contactData.lastName}
            onChange={(e) => updateContactData("lastName", e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={contactData.phone}
          onChange={(e) => updateContactData("phone", e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={contactData.email}
          onChange={(e) => updateContactData("email", e.target.value)}
          placeholder="john.doe@example.com"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={contactData.company}
            onChange={(e) => updateContactData("company", e.target.value)}
            placeholder="Acme Corp"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={contactData.title}
            onChange={(e) => updateContactData("title", e.target.value)}
            placeholder="Software Engineer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={contactData.address}
          onChange={(e) => updateContactData("address", e.target.value)}
          placeholder="123 Main St"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={contactData.city}
            onChange={(e) => updateContactData("city", e.target.value)}
            placeholder="New York"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            value={contactData.state}
            onChange={(e) => updateContactData("state", e.target.value)}
            placeholder="NY"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP Code</Label>
          <Input
            id="zipCode"
            value={contactData.zipCode}
            onChange={(e) => updateContactData("zipCode", e.target.value)}
            placeholder="10001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={contactData.country}
            onChange={(e) => updateContactData("country", e.target.value)}
            placeholder="United States"
          />
        </div>
      </div>
    </div>
  );
}
