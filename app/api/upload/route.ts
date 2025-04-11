import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ message: 'No file uploaded.' }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const relativePath = `/team/${filename}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);

    console.log(`Speichere Bild nach: ${absolutePath}`); // Debugging
    await writeFile(absolutePath, buffer);
    console.log(`Datei erfolgreich gespeichert unter ${relativePath}`); // Debugging

    return NextResponse.json(
      { success: true, imageUrl: relativePath },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving file locally:', error);
    return NextResponse.json(
      { message: 'Error saving file.' },
      { status: 500 }
    );
  }

  // --- ODER: Logik für Cloud-Speicher (z.B. Vercel Blob) ---
  /*
  try {
      const { url } = await put(file.name, file, { access: 'public' }); // Vercel Blob Beispiel
      return NextResponse.json({ success: true, imageUrl: url }, { status: 201 });
  } catch (error) {
      console.error("Error uploading to Blob Storage:", error);
      return NextResponse.json({ message: 'Error uploading file.' }, { status: 500 });
  }
  */
}
