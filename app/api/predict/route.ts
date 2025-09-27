import { NextResponse } from "next/server";
import { Client } from "@gradio/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await Client.connect("RentPrediction/Fin_analysis", {
      hf_token: process.env.HF_TOKEN, 
    });

    const result = await client.predict("/predict", {
      subject_prefix: body.propertySubject,
      unit_category: body.unitType,
      unit_status: body.unitStatus,
      occupied_units: body.occupiedUnits,
      vacant_units: body.vacantUnits,
      client_base_rent: body.clientBaseRent,
      client_rent_of_care: body.clientRentOfCare,
      market_base_rent: body.marketBaseRent,
      market_rent_of_care: body.marketRentOfCare,
      desired_occupancy_rate: body.desiredOccupancy,
    });

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error("Prediction API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prediction" },
      { status: 500 }
    );
  }
}
