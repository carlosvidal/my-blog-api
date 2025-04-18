import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Busca o crea el admin
  let admin = await prisma.admin.findUnique({ where: { email: "admin@example.com" } });
  if (!admin) {
    admin = await prisma.admin.create({
      data: {
        email: "admin@example.com",
        password: "securepassword",
        name: "Admin User",
        role: "ADMIN"
      }
    });
  }
  console.log({ admin });

  // 2. Busca o crea un blog principal asociado al admin
  let blog = await prisma.blog.upsert({
    where: { adminId: admin.id },
    update: {},
    create: {
      name: "Blog Principal",
      subdomain: "demo",
      plan: "FREE",
      adminId: admin.id,
      title: "Blog Principal",
      description: "Un blog de ejemplo para pruebas.",
      language: "es",
      template: "default",
      googleAnalyticsId: "",
      socialNetworks: { twitter: "", facebook: "", instagram: "" }
    }
  });
  console.log({ blog });

  // 3. Crea o reutiliza categorías asociadas al blog
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "tecnologia" },
      update: {},
      create: { name: "Tecnología", slug: "tecnologia", blogId: blog.id }
    }),
    prisma.category.upsert({
      where: { slug: "vida" },
      update: {},
      create: { name: "Vida", slug: "vida", blogId: blog.id }
    }),
    prisma.category.upsert({
      where: { slug: "noticias" },
      update: {},
      create: { name: "Noticias", slug: "noticias", blogId: blog.id }
    })
  ]);
  console.log({ categories });

  // 4. Crea posts asociados al blog y categorías
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { slug: "primer-post" },
      update: {},
      create: {
        title: "Primer post de ejemplo",
        slug: "primer-post",
        content: "Este es el contenido del primer post de ejemplo.",
        authorId: admin.id,
        categoryId: categories[0].id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.post.upsert({
      where: { slug: "segundo-post" },
      update: {},
      create: {
        title: "Segundo post",
        slug: "segundo-post",
        content: "Contenido del segundo post.",
        authorId: admin.id,
        categoryId: categories[1].id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.post.upsert({
      where: { slug: "tercer-post" },
      update: {},
      create: {
        title: "Tercer post",
        slug: "tercer-post",
        content: "Contenido del tercer post.",
        authorId: admin.id,
        categoryId: categories[2].id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.post.upsert({
      where: { slug: "cuarto-post" },
      update: {},
      create: {
        title: "Cuarto post",
        slug: "cuarto-post",
        content: "Contenido del cuarto post.",
        authorId: admin.id,
        categoryId: categories[0].id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.post.upsert({
      where: { slug: "quinto-post" },
      update: {},
      create: {
        title: "Quinto post",
        slug: "quinto-post",
        content: "Contenido del quinto post.",
        authorId: admin.id,
        categoryId: categories[1].id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    })
  ]);
  console.log({ posts });

  // Crear páginas
  const pages = await Promise.all([
    prisma.page.upsert({
      where: { slug: "sobre-nosotros" },
      update: {},
      create: {
        title: "Sobre Nosotros",
        slug: "sobre-nosotros",
        content: "Esta es la página sobre nosotros.",
        authorId: admin.id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.page.upsert({
      where: { slug: "contacto" },
      update: {},
      create: {
        title: "Contacto",
        slug: "contacto",
        content: "Página de contacto.",
        authorId: admin.id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.page.upsert({
      where: { slug: "privacidad" },
      update: {},
      create: {
        title: "Política de Privacidad",
        slug: "privacidad",
        content: "Política de privacidad del sitio.",
        authorId: admin.id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    }),
    prisma.page.upsert({
      where: { slug: "terminos" },
      update: {},
      create: {
        title: "Términos y Condiciones",
        slug: "terminos",
        content: "Términos y condiciones de uso.",
        authorId: admin.id,
        blogId: blog.id,
        publishedAt: new Date()
      }
    })
  ]);
  console.log({ pages });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
