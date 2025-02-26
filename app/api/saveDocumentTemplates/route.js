import { connectToDB } from '@/lib/mongoose';
import User from '@/lib/models/user.model';

export async function POST(req) {
  try {
    await connectToDB();
    const { id, documentName,martialSettlementAgreement, civilActionComplaintForDivorce, civilActionComplaintForDivorceJudgementDemands } = await req.json();

    let updateField = {};

    if (documentName === 'civilActionComplaintForDivorce') {
      updateField['documentTemplatesExtraDetails.civilActionComplaintForDivorce'] = civilActionComplaintForDivorce;
    } else if (documentName === 'civilActionComplaintForDivorceJudgementDemands') {
      updateField['documentTemplatesExtraDetails.civilActionComplaintForDivorceJudgementDemands'] = civilActionComplaintForDivorceJudgementDemands;
    }  else if (documentName === 'martialSettlementAgreement') {
      updateField['documentTemplatesExtraDetails.martialSettlementAgreement'] = martialSettlementAgreement;
    }

    else {
      return new Response(JSON.stringify({ message: 'Invalid document name' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $set: updateField },
        { new: true, upsert: true }
    );

    return new Response(JSON.stringify({ message: 'Data saved successfully!', data: updatedUser }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
