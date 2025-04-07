import React from "react";
import {
    Calendar,
    Heart,
    MessageSquare,
    Share2,
    Bookmark,
    ChevronRight,
} from "lucide-react";

export default function FeaturedNews({
    id,
    title,
    description,
    content,
    date,
    image,
    tags = [],
    category = "Noticia principal",
}) {
    return (
        <div className="dashboard-event-card">
            <div className="dashboard-event-header">
                <div>
                    <span className="status-badge tag-blue px-3 py-1 mb-2">
                        {category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-contrast-light">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar size={18} className="icon-inactive" />
                    <span className="text-contrast-subtle">{date}</span>
                </div>
            </div>
            <div className="dashboard-event-content">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        <p className="text-contrast-medium mb-4">
                            {description}
                        </p>
                        <p className="text-contrast-medium mb-4">{content}</p>
                        <div className="flex flex-wrap gap-2 mt-6">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-sm px-3 py-1 tag-blue"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="md:w-1/3">
                        <img
                            src={image || "/placeholder.jpg"}
                            alt={title}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                </div>
            </div>
            <div className="dashboard-event-footer">
                <div className="flex gap-3">
                    <button className="icon-wrapper icon-blue">
                        <Heart size={18} />
                    </button>
                    <button className="icon-wrapper icon-purple">
                        <MessageSquare size={18} />
                    </button>
                    <button className="icon-wrapper icon-green">
                        <Share2 size={18} />
                    </button>
                    <button className="icon-wrapper icon-orange">
                        <Bookmark size={18} />
                    </button>
                </div>
                <a
                    href={`/noticias/${id}`}
                    className="gradient-bg px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                >
                    <span>Leer artículo completo</span>
                    <ChevronRight size={16} />
                </a>
            </div>
        </div>
    );
}
