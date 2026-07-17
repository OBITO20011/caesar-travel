-- Create actionable admin notifications from operational events.

CREATE OR REPLACE FUNCTION public.notify_admin_on_booking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.notifications (type, title, message, related_id)
  VALUES (
    'booking_new',
    'طلب حجز جديد',
    'تم استلام طلب حجز من ' || NEW.customer_name ||
      COALESCE(' للرحلة ' || NULLIF(NEW.trip_name, ''), ''),
    NEW.id
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bookings_notify_admin ON public.bookings;
CREATE TRIGGER bookings_notify_admin
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_on_booking();

CREATE OR REPLACE FUNCTION public.notify_admin_on_trip_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    INSERT INTO public.notifications (type, title, message, related_id)
    VALUES ('trip_completed', 'اكتملت رحلة', 'تم تغيير حالة رحلة ' || NEW.name || ' إلى مكتملة.', NEW.id);
  ELSIF NEW.status = 'cancelled' THEN
    INSERT INTO public.notifications (type, title, message, related_id)
    VALUES ('trip_cancelled', 'أُلغيت رحلة', 'تم تغيير حالة رحلة ' || NEW.name || ' إلى ملغاة.', NEW.id);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_notify_admin_on_status ON public.trips;
CREATE TRIGGER trips_notify_admin_on_status
AFTER UPDATE OF status ON public.trips
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('completed', 'cancelled'))
EXECUTE FUNCTION public.notify_admin_on_trip_status();
