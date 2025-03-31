import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET route to fetch all schools
export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json({ schools });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

// POST route to add schools
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Handle single school or array of schools
    if (Array.isArray(body.schools)) {
      // Bulk create schools
      const createdSchools = await prisma.$transaction(
        body.schools.map(school => 
          prisma.school.create({
            data: {
              name: school.name,
              address: school.address,
              city: school.city,
              state: school.state,
              zip: school.zip,
              district: school.district || null,
              latitude: school.latitude || null,
              longitude: school.longitude || null,
            }
          })
        )
      );
      
      return NextResponse.json({ schools: createdSchools }, { status: 201 });
    } else {
      // Create a single school
      const newSchool = await prisma.school.create({
        data: {
          name: body.name,
          address: body.address,
          city: body.city,
          state: body.state,
          zip: body.zip,
          district: body.district || null,
          latitude: body.latitude || null,
          longitude: body.longitude || null,
        }
      });
      
      return NextResponse.json({ school: newSchool }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating school(s):', error);
    return NextResponse.json(
      { error: 'Failed to create school(s)' },
      { status: 500 }
    );
  }
}

// DELETE route to delete all schools (admin only)
export async function DELETE() {
  try {
    // In a real app, you would check for admin authorization here
    
    // Delete all schools
    await prisma.school.deleteMany({});
    
    return NextResponse.json({ message: 'All schools deleted successfully' });
  } catch (error) {
    console.error('Error deleting schools:', error);
    return NextResponse.json(
      { error: 'Failed to delete schools' },
      { status: 500 }
    );
  }
} 