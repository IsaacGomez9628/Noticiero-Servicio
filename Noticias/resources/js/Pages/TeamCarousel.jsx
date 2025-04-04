import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function TeamCarousel({ teamMembers }) {
    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-blue-50 rounded-lg my-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Nuestro Equipo
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto rounded-full mb-6"></div>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Somos un grupo dinámico de individuos apasionados por lo
                        que hacemos y dedicados a entregar los mejores
                        resultados para nuestros clientes.
                    </p>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    navigation
                    autoplay={{ delay: 5000 }}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                    className="w-full"
                >
                    {teamMembers.map((member) => (
                        <SwiperSlide key={member.id}>
                            <div className="group relative h-[400px] rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:shadow-xl">
                                {/* Imagen con gradiente superpuesto */}
                                <div className="h-full w-full">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Gradiente que siempre está presente pero más intenso en hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300"></div>
                                </div>

                                {/* Información básica (siempre visible) */}
                                <div className="absolute bottom-0 left-0 p-4 text-white z-10 transition-all duration-500 group-hover:transform group-hover:translate-y-[-45%]">
                                    <h3 className="text-xl font-bold">
                                        {member.name}
                                    </h3>
                                    <p className="text-white/90">
                                        {member.title}
                                    </p>
                                    <p className="text-white/80 text-sm">
                                        {member.location}
                                    </p>
                                </div>

                                {/* Descripción (visible solo en hover) */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 text-white transform translate-y-full transition-transform duration-500 group-hover:translate-y-0">
                                    <p className="text-sm leading-relaxed opacity-90 line-clamp-6">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
