import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './ContentForm.css';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function ContentForm({ initialData, type, onSubmit, submitLabel }) {
    const { t, language } = useLanguage();

    const [formData, setFormData] = useState({
        type: type || initialData?.type || 'movie',
        title: initialData?.title || '',
        imageurl: initialData?.imageurl || '',
        genre: initialData?.genre || '',
        synopsis: initialData?.synopsis || '',
        state: initialData?.state || '',
        duration: initialData?.duration || '',
        episodes: initialData?.episodes || ''
    });

    const [imageError, setImageError] = useState('');

    const localText = {
        imageUrl: language === 'en' ? 'Image URL' : 'URL da imagem',
        imageFile: language === 'en' ? 'Or choose an image from your computer' : 'Ou escolhe uma imagem do computador',
        imageHelp: language === 'en'
            ? 'You can paste an image link or choose a file from your computer.'
            : 'Podes colar um link de imagem ou escolher um ficheiro do computador.',
        imageTooLarge: language === 'en'
            ? 'The image is too large. Choose an image up to 2 MB.'
            : 'A imagem é demasiado grande. Escolhe uma imagem até 2 MB.',
        imageInvalid: language === 'en'
            ? 'Choose a valid image file.'
            : 'Escolhe um ficheiro de imagem válido.',
        imagePreview: language === 'en' ? 'Image preview' : 'Pré-visualização da imagem'
    };

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    function handleImageUrlChange(event) {
        setImageError('');

        setFormData((previous) => ({
            ...previous,
            imageurl: event.target.value
        }));
    }

    function handleImageFileChange(event) {
        const file = event.target.files?.[0];

        setImageError('');

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            setImageError(localText.imageInvalid);
            event.target.value = '';
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setImageError(localText.imageTooLarge);
            event.target.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setFormData((previous) => ({
                ...previous,
                imageurl: reader.result
            }));
        };

        reader.onerror = () => {
            setImageError(localText.imageInvalid);
        };

        reader.readAsDataURL(file);
    }

    function handleSubmit(event) {
        event.preventDefault();
        onSubmit(formData);
    }

    const isSeries = formData.type === 'series';
    const imageUrlInputValue = formData.imageurl?.startsWith('data:image') ? '' : formData.imageurl;

    return (
        <form className="content-form" onSubmit={handleSubmit}>
            <div className="form-grid">
                <label>
                    {t('contentTitle')}
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    {t('genre')}
                    <input
                        type="text"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        placeholder="Ação, Comédia, Drama..."
                    />
                </label>

                <label>
                    {localText.imageUrl}
                    <input
                        type="url"
                        name="imageurl"
                        value={imageUrlInputValue}
                        onChange={handleImageUrlChange}
                        placeholder="https://..."
                    />
                </label>

                <label>
                    {t('status')}
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder={isSeries ? 'Em produção' : 'Lançado'}
                    />
                </label>

                <label>
                    {t('duration')}
                    <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        min="0"
                    />
                </label>

                {isSeries && (
                    <label>
                        {t('episodes')}
                        <input
                            type="number"
                            name="episodes"
                            value={formData.episodes}
                            onChange={handleChange}
                            min="0"
                        />
                    </label>
                )}
            </div>

            <label>
                {localText.imageFile}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                />
                <span className="content-form-help">{localText.imageHelp}</span>
            </label>

            {imageError && (
                <p className="content-form-error" role="alert">{imageError}</p>
            )}

            {formData.imageurl && (
                <div className="content-form-preview">
                    <p>{localText.imagePreview}</p>
                    <img
                        src={formData.imageurl}
                        alt={formData.title || localText.imagePreview}
                        onError={(event) => {
                            event.currentTarget.src = '/flogo.png';
                        }}
                    />
                </div>
            )}

            <label>
                {t('synopsis')}
                <textarea
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleChange}
                    rows="6"
                />
            </label>

            <button type="submit" className="content-form-submit">
                {submitLabel}
            </button>
        </form>
    );
}

export default ContentForm;