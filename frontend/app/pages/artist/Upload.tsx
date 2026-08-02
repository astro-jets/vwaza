import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

export default function Home() {
    const cld = new Cloudinary({ cloud: { cloudName: 'dir8vbrt7' } });

    // Use this sample image or upload your own via the Media Library
    const img = cld
        .image('cld-sample-2')
        .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

    return (<AdvancedImage cldImg={img} />);
}
